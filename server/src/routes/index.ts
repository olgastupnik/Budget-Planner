import router from "koa-joi-router";

import { userRoutes } from "./user.routes";
import { historyRoutes } from "./history.routes";
import { categoryRoutes } from "./category.routes";
import { communalRoutes } from "./communal.routes";
import { wishListRouters } from "./wishList.routes";

const apiRouter: router.Router = router();
apiRouter.prefix("/api");

apiRouter.use(userRoutes.middleware());
apiRouter.use(historyRoutes.middleware());
apiRouter.use(categoryRoutes.middleware());
apiRouter.use(communalRoutes.middleware());
apiRouter.use(wishListRouters.middleware());

export { apiRouter };
