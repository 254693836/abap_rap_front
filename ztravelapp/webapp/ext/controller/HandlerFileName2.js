sap.ui.define([
    "sap/m/MessageToast"
], function(MessageToast) {
    'use strict';

    return {
        /**
         * Generated event handler.
         *
         * @param oContext the context of the page on which the event was fired. `undefined` for list report page.
         * @param aSelectedContexts the selected contexts of the table rows.
         */
        listActionIDDeal: function(oContext, aSelectedContexts) {
            MessageToast.show("Custom handler invoked.22222222222222");
        }
    };
});
