import logger from 'pino';
import dayjs from 'dayjs';
import { config } from '../config/config';

const level = config.logging.level;
console.log(level);
const log = logger({
    transport: { target: 'pino-pretty' },
    level,
    base: {
        pid: false
    },
    timestamp: () => `,"time":"${dayjs().format()}"`
});

export default log;
