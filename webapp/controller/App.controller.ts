import ResourceBundle from "sap/base/i18n/ResourceBundle";
import { URLHelper } from "sap/m/library";
import { ListItemBase$PressEvent } from "sap/m/ListItemBase";
import Panel from "sap/m/Panel";
import Locale from "sap/ui/core/Locale";
import LocaleData from "sap/ui/core/LocaleData";
import Controller from "sap/ui/core/mvc/Controller";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import Currency from "sap/ui/model/type/Currency";
// import UIControl from "sap/ui/core/Control";
import ListItemBase from "sap/m/ListItemBase";
import ObjectAttribute from "sap/m/ObjectAttribute";
import ObjectListItem from "sap/m/ObjectListItem";
import Context from "sap/ui/model/Context";
import StandardListItem from "sap/m/StandardListItem";

/**
 * @namespace zts002.controller
 */

class ZLocaleData extends LocaleData{
    mData: {
        currencyFormat: object
    }
} 

export default abstract class AppController extends Controller {
	onInit(): void {}

	formatMail(sFirstName: string, sLastName: string): string {
		const oBundle = (
			this.getView().getModel("i18n") as ResourceModel
		).getResourceBundle() as ResourceBundle;

		return URLHelper.normalizeEmail(
			sFirstName + "." + sLastName + "@example.com",
			oBundle.getText("mailSubject", [sFirstName]),
			oBundle.getText("mailBody")
		);
	}

    formatStockValue (fUnitPrice: number, iStockLevel: number, sCurrCode:string): string{
        const sBrowserLocale = sap.ui.getCore().getConfiguration().getLanguage();
        const oLocale = new Locale(sBrowserLocale);
        const oLocaleData = new LocaleData(oLocale) as ZLocaleData;
        const oCurrency = new Currency(oLocaleData.mData.currencyFormat);
        return oCurrency.formatValue([fUnitPrice * iStockLevel, sCurrCode], "string");
    }

    onItemSelected(oEvent:ListItemBase$PressEvent):void {
        const oSelectedItem = oEvent.getSource();
        const oContext = oSelectedItem.getBindingContext("products");

        const oProductDetailPanel = this.byId("productDetailsPanel") as Panel;
        oProductDetailPanel.bindElement({
            path: oContext.getPath(),
            model: "products"
        });
    }

    productListFactory (sId: string, oContext: Context): ListItemBase {
        let oUIControl: ListItemBase;

        // Decide based on the data which dependent to clone
        if (oContext.getProperty("UnitsInStock") === 0 && oContext.getProperty("Discontinued")) {
            // The item is discontinued, so use a StandardListItem
            oUIControl = this.byId("productSimple").clone(sId) as StandardListItem;
        } else {
            // The item is available, so we will create an ObjectListItem
            const objectListItem = this.byId("productExtended").clone(sId) as ObjectListItem;
            oUIControl = objectListItem

            // The item is temporarily out of stock, so we will add a status
            if (oContext.getProperty("UnitsInStock") < 1) {
                objectListItem.addAttribute(new ObjectAttribute({
                    text : {
                        path: "i18n>outOfStock"
                    }
                }));
            }             
        }

        return oUIControl;
    }
}
