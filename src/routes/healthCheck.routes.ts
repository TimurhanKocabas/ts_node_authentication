import { Router } from 'express';

const healthCheckRouter = Router();
healthCheckRouter.get('/healthcheck', (_, resp) => {
    resp.status(200).json('I am alive');
});

export default healthCheckRouter;
