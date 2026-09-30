/* global Promise */
/* eslint-disable no-console -- Reference hooks intentionally log their invocation. */
sap.ui.define([
    "sap/ui/core/mvc/ControllerExtension",
    "sap/m/MessageBox"
], function (ControllerExtension, MessageBox) {
    "use strict";

    return ControllerExtension.extend("ztravelappunmanaged.ext.controller.ObjectPageExtension", {
        override: {
            editFlow: {
                // 新規作成前。parametersには対象のcontextなどが渡されます。
                onBeforeCreate: async function (parameters) {
                    console.log("[editFlow] onBeforeCreate", parameters);
                },

                // 新規作成後。parametersには対象のcontextなどが渡されます。
                onAfterCreate: async function (parameters) {
                    console.log("[editFlow] onAfterCreate", parameters);
                },

                // 削除前。parametersには対象のcontextなどが渡されます。
                onBeforeDelete: async function (parameters) {
                    console.log("[editFlow] onBeforeDelete", parameters);
                },

                // 削除後。parametersには対象のcontextなどが渡されます。
                onAfterDelete: async function (parameters) {
                    console.log("[editFlow] onAfterDelete", parameters);
                },

                // 編集内容の破棄前。parametersには対象のcontextなどが渡されます。
                onBeforeDiscard: async function (parameters) {
                    console.log("[editFlow] onBeforeDiscard", parameters);
                },

                // 編集内容の破棄後。parametersには対象のcontextなどが渡されます。
                onAfterDiscard: async function (parameters) {
                    console.log("[editFlow] onAfterDiscard", parameters);
                },

                // 編集モードへの切り替え後。parametersには対象のcontextなどが渡されます。
                onAfterEdit: async function (parameters) {
                    console.log("[editFlow] onAfterEdit", parameters);
                },

                // 保存前。parametersには対象のcontextなどが渡されます。
                onBeforeSave: async function (parameters) {
                    console.log("[editFlow] onBeforeSave", parameters);
                },

                // 保存後。parametersには対象のcontextなどが渡されます。
                onAfterSave: async function (parameters) {
                    console.log("[editFlow] onAfterSave", parameters);
                },

                // 編集開始前。既存のBooking Fee確認処理を実行します。
                onBeforeEdit: async function (parameters) {
                    console.log("[editFlow] onBeforeEdit", parameters);
                    const context = parameters.context;
                    const fee = await context.requestProperty("BookingFee");
                    if (Number(fee) <= 500) {
                        return;
                    }
                    const bundle = await this.base.getView().getModel("i18n").getResourceBundle();
                    // Resolve only for Yes. No, Escape, or closing the dialog
                    // rejects the edit flow and keeps the page in display mode.
                    await new Promise(function (resolve, reject) {
                        MessageBox.confirm(bundle.getText("bookingFeeEditConfirm", [fee]), {
                            title: bundle.getText("bookingFeeEditTitle"),
                            actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                            emphasizedAction: MessageBox.Action.YES,
                            initialFocus: MessageBox.Action.NO,
                            onClose: function (action) {
                                if (action === MessageBox.Action.YES) {
                                    resolve();
                                } else {
                                    reject();
                                }
                            }
                        });
                    });
                }
            }
        }
    });
});
