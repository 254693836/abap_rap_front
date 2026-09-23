sap.ui.define([
    "sap/ui/test/opaQunit",
    "./pages/JourneyRunner"
], function (opaTest, runner) {
    "use strict";

    function journey() {
        QUnit.module("First journey");

        opaTest("Start application", function (Given, When, Then) {
            Given.iStartMyApp();

            Then.onTheTravelList.iSeeThisPage();
            Then.onTheTravelList.onFilterBar().iCheckFilterField("Travel ID");
            Then.onTheTravelList.onFilterBar().iCheckFilterField("Agency ID");
            Then.onTheTravelList.onFilterBar().iCheckFilterField("Customer ID");
            Then.onTheTravelList.onTable().iCheckColumns(6, {"TravelID":{"header":"Travel ID"},"AgencyID":{"header":"Agency ID"},"CustomerID":{"header":"Customer ID"},"BeginDate":{"header":"Starting Date"},"EndDate":{"header":"End Date"},"OverallStatus":{"header":"Overall Status"}});

        });


        opaTest("Navigate to ObjectPage", function (Given, When, Then) {
            // Note: this test will fail if the ListReport page doesn't show any data
            
            When.onTheTravelList.onFilterBar().iExecuteSearch();
            
            Then.onTheTravelList.onTable().iCheckRows();

            When.onTheTravelList.onTable().iPressRow(0);
            Then.onTheTravelObjectPage.iSeeThisPage();

        });

        opaTest("Teardown", function (Given, When, Then) { 
            // Cleanup
            Given.iTearDownMyApp();
        });
    }

    runner.run([journey]);
});