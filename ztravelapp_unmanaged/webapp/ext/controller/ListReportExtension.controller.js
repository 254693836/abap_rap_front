/* global Promise */
/* eslint-disable no-console -- Reference hooks intentionally log their invocation. */
/* eslint-disable @sap-ux/fiori-tools/sap-no-navigator -- Camera permission is checked before starting the scanner. */
sap.ui.define([
    "sap/ui/core/mvc/ControllerExtension",
    "sap/ui/core/Core",
    "sap/base/Log",
    "sap/m/MessageToast",
    "sap/ndc/BarcodeScanner"
], function (ControllerExtension, Core, Log, MessageToast, BarcodeScanner) {
    "use strict";

    return ControllerExtension.extend("ztravelappunmanaged.ext.controller.ListReportExtension", {
        QRScan: async function () {
            try {
                const result = await this._scanQRCode();
                if (result.cancelled) {
                    MessageToast.show("QR scan cancelled.");
                    return;
                }

                MessageToast.show(result.text ? "QR code: " + result.text : "No QR code was detected.");
            } catch (error) {
                Log.error("QR scan failed", String(error));
                MessageToast.show(error instanceof Error ? error.message : "QR scan failed.");
            }
        },

        _scanQRCode: async function () {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error("Camera scanning is not available in this browser.");
            }

            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: false,
                    video: {
                        facingMode: {
                            ideal: "environment"
                        }
                    }
                });
                stream.getTracks().forEach(function (track) {
                    track.stop();
                });
            } catch (error) {
                Log.error("Camera access for QR scan failed", String(error));
                throw new Error("Camera access is required to scan a QR code.");
            }

            // The ninth argument suppresses the BarcodeScanner text-input fallback.
            if (BarcodeScanner.scan.length < 10) {
                throw new Error("QR camera scanning requires a newer SAPUI5 version.");
            }

            return new Promise(function (resolve, reject) {
                let attempts = 0;
                const attachCloseHandler = function () {
                    const scanDialog = Core.byId("sapNdcBarcodeScannerDialog");
                    if (scanDialog) {
                        scanDialog.attachEventOnce("afterClose", function () {
                            resolve({
                                cancelled: true,
                                text: ""
                            });
                        });
                        return;
                    }

                    attempts += 1;
                    if (attempts < 20) {
                        // eslint-disable-next-line @sap-ux/fiori-tools/sap-timeout-usage -- Wait for the scanner dialog to be created.
                        setTimeout(attachCloseHandler, 50);
                    }
                };

                BarcodeScanner.scan(
                    resolve,
                    reject,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    true,
                    function () {
                        reject(new Error("QR camera scanning is unavailable. Barcode input is disabled."));
                    }
                );
                attachCloseHandler();
            });
        },

        override: {
            onInit: function () {
                console.log("[ListReport] onInit");
                this.base.getView().addStyleClass("travelListReportLeftAlignedHeaders");
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
