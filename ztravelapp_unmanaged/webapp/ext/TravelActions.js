/* global Promise */
sap.ui.define([
    "sap/m/MessageBox",
    "sap/m/MessageToast"
], function (MessageBox, MessageToast) {
    "use strict";

    const SERVICE = "com.sap.gateway.srvd.zlyz210_ui_travel_sol.v0001.";
    let running = false;

    async function parametersFor(context) {
        const model = context.getModel();
        const meta = model.getMetaModel();
        const overloads = await meta.requestObject("/" + SERVICE + "ADD_ACTION001");
        const action = overloads.find(function (candidate) {
            return candidate.$IsBound && candidate.$Parameter[0].$Type === SERVICE + "TravelType";
        });
        if (!action) {
            throw new Error("ADD_ACTION001 is not available in the service metadata.");
        }
        const available = await context.requestProperty("__OperationControl/ADD_ACTION001");
        if (available === false) {
            throw new Error("ADD_ACTION001 is unavailable for " + context.getPath());
        }

        // Audit fields are absent from TravelType; Attachment is a stream on
        // TravelType but a binary action parameter. The bound defaults function
        // supplies these values in the action's parameter structure.
        const defaultsBinding = model.bindContext(SERVICE + "GetDefaultsForAddAction001(...)", context);
        let defaults;
        try {
            await defaultsBinding.execute();
            defaults = await defaultsBinding.getBoundContext().requestObject();
        } finally {
            defaultsBinding.destroy();
        }
        const entity = await meta.requestObject("/" + SERVICE + "TravelType");
        return Promise.all(action.$Parameter.slice(1).map(async function (parameter) {
            const name = parameter.$Name;
            const property = entity[name];
            const value = property && property.$kind === "Property" && property.$Type !== "Edm.Stream"
                ? await context.requestProperty(name)
                : defaults[name];
            if (value === undefined || (value === null && parameter.$Nullable === false)) {
                throw new Error("Missing action parameter: " + name);
            }
            return {name: name, value: value};
        }));
    }

    return {
        // Fiori elements supplies the ExtensionAPI as this and preserves the
        // complete entity key (including DraftUUID and IsActiveEntity).
        ADD_ACTION002: async function (context, selectedContexts) {
            if (running) {
                return;
            }
            let contexts = context ? [context] : [];
            if (selectedContexts && selectedContexts.length) {
                contexts = selectedContexts.slice();
            }
            const bundle = await this.getModel("i18n").getResourceBundle();
            if (running) {
                return;
            }
            if (!contexts.length) {
                MessageToast.show(bundle.getText("addActionSelectRow"));
                return;
            }
            running = true;
            let completed = 0;
            try {
                // Validate and snapshot every row before any modifying request.
                const prepared = [];
                for (const item of contexts) {
                    prepared.push(await parametersFor(item));
                }
                for (let index = 0; index < contexts.length; index += 1) {
                    await this.getEditFlow().invokeAction(SERVICE + "ADD_ACTION001", {
                        contexts: contexts[index],
                        parameterValues: prepared[index],
                        skipParameterDialog: true,
                        requiresNavigation: false,
                        invocationGrouping: "Isolated",
                        label: "ADD_ACTION002"
                    });
                    completed += 1;
                }
                MessageToast.show(bundle.getText("addActionSuccess", [completed]));
            } catch (error) {
                MessageBox.error(bundle.getText("addActionFailure", [completed, contexts.length]), {
                    details: error instanceof Error ? error.message : String(error)
                });
            } finally {
                running = false;
            }
        }
    };
});
