import XMLView from "sap/ui/core/mvc/XMLView";
// import BindingMode from "sap/ui/model/BindingMode";
import JSONModel from "sap/ui/model/json/JSONModel";
import ResourceModel from "sap/ui/model/resource/ResourceModel";


export default class InitAll {
	static {
		const oProductModel = new JSONModel();
		void oProductModel.loadData("./model/Products.json");
		sap.ui.getCore().setModel(oProductModel, "products");

		// Create a JSON model from an object literal
		const oModel = new JSONModel({
			firstName: "Harry",
			lastName: "Hawk",
			enabled: true,
			panelHeaderText: "Data Binding Basics",
			address: {
				street: "Dietmar-Hopp-Allee 16",
				city: "Walldorf",
				zip: "69190",
				country: "Germany"
			},
			salesAmount: 12345.6789,
			priceThreshold: 20,
			currencyCode: "EUR"
		});
		// oModel.setDefaultBindingMode(BindingMode.OneWay);

		// Assign the model object to the SAPUI5 core
		sap.ui.getCore().setModel(oModel);


		const oResourceModel = new ResourceModel({
			bundleName: "zts002.i18n.i18n",
			supportedLocales: ["", "de"],
			fallbackLocale: ""
		});

		// Assign the model object to the SAPUI5 core using the name "i18n"
		sap.ui.getCore().setModel(oResourceModel, "i18n");

		// Display the XML view called "App"
		const oView = new XMLView({
			viewName: "zts002.view.App"
		});

		// Register the view with the message manager
		sap.ui.getCore().getMessageManager().registerObject(oView, true);

		// Insert the view into the DOM
		oView.placeAt("content");
	}
}
