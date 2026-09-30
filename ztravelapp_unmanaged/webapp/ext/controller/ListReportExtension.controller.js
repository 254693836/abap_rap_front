/* eslint-disable no-console -- Reference hooks intentionally log their invocation. */
sap.ui.define([
    "sap/ui/core/mvc/ControllerExtension",
    "sap/base/Log"
], function (ControllerExtension, Log) {
    "use strict";

    return ControllerExtension.extend("ztravelappunmanaged.ext.controller.ListReportExtension", {
        override: {
            onInit: function () {
                console.log("[ListReport] onInit");
            },

            onBeforeRendering: function () {
                console.log("[ListReport] onBeforeRendering");
            },

            onExit: function () {
                console.log("[ListReport] onExit");
            },

            // 一覧画面の新規作成・削除フローを確認するためのフック。
            editFlow: {
                onBeforeCreate: async function (parameters) {
                    console.log("[ListReport.editFlow] onBeforeCreate", parameters);
                },
                onAfterCreate: async function (parameters) {
                    console.log("[ListReport.editFlow] onAfterCreate", parameters);
                },
                onBeforeDelete: async function (parameters) {
                    console.log("[ListReport.editFlow] onBeforeDelete", parameters);
                },
                onAfterDelete: async function (parameters) {
                    console.log("[ListReport.editFlow] onAfterDelete", parameters);
                }
            },
            onAfterRendering: function () {
                console.log("[ListReport] onAfterRendering");
                // Apply once, after the filter bar exists. Subsequent rendering
                // must preserve changes the user makes to the search conditions.
                if (this._travelFilterInitialized) {
                    return;
                }
                this._travelFilterInitialized = true;
                this.base.getExtensionAPI().setFilterValues("TravelID", "LT", "10").catch(function (error) {
                    Log.error("Could not initialize the Travel ID filter", String(error));
                });
            }
        }
    });
});
