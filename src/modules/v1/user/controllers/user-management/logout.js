import { responseHandler } from "../../../../../utils/response-handler";
import { logoutSession } from "../../../../../utils/encrypt";


class LogoutController {

  

    /**
      * @description   api to user logout
      * @param {*} req /api/v1/user/logout
      * @param {*} res 
      */

    async delete(req, res) {

        try {
            const token = req.headers.authorization.split(" ")[1]
            const user = await logoutSession(token)
            if (user) {
                return responseHandler.successResponse(res, {}, "User logged out successfull", 200);
            } else {
                return responseHandler.errorResponse(res, {}, "In valid session", 400);
            }
        }
        catch (err) {
            console.error(err);
            return responseHandler.errorResponse(res, err);
        }

    }
}

export default new LogoutController();

