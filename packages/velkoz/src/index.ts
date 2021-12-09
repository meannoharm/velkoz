import Velkoz from "@velkoz/core";
import NavigationTiming from "@velkoz/navigation-timing";
import RealUserMonitoring from "@velkoz/real-user-monitoring";
import JsError from "@velkoz/js-error";
import NetworkError from "@velkoz/network-error";

Velkoz.use(NavigationTiming).use(RealUserMonitoring).use(JsError).use(NetworkError);

export default Velkoz;
