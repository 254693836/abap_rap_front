sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"ztravelappunmanaged/test/integration/pages/TravelList",
	"ztravelappunmanaged/test/integration/pages/TravelObjectPage"
], function (JourneyRunner, TravelList, TravelObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('ztravelappunmanaged') + '/test/flp.html#app-preview',
        pages: {
			onTheTravelList: TravelList,
			onTheTravelObjectPage: TravelObjectPage
        },
        async: true
    });

    return runner;
});

