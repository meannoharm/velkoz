import Velkoz from "@velkoz/core";
import NavigationTiming from "@velkoz/navigation-timing";
import RealUserMonitoring from "@velkoz/real-user-monitoring";
import JsError from "@velkoz/js-error";

Velkoz.use(NavigationTiming).use(RealUserMonitoring).use(JsError);

export default Velkoz;
