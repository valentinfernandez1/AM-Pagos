
//UserRoutes
import loginRoute from "./userRoutes/loginRoute";
import balanceRoute from "./userRoutes/balanceRoute";
import historyRoute from "./userRoutes/historyRoute";

//utilityRoutes
import utilityRoute from "./utilityRoutes/utilityRoute";

export default  {
    userRoutes: [loginRoute, balanceRoute, historyRoute],
    utilityRoutes: [utilityRoute]
}