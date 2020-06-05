import { MapCard            } from './map.js';
import { FilterCard         } from './filter.js';
import { StatsTypeCard      } from './statsType.js';
import { StatsRejectedCard  } from './statsRejected.js';
import { CountMonthCard     } from './countMonth.js';
import { QuotasCard         } from './quotas.js';
import { BsCard             } from './bs/bs.js';

window.dashboard = {
    map:            new MapCard(),
    filter:         new FilterCard(),
    statsType:      new StatsTypeCard(),
    statsRejected:  new StatsRejectedCard(),
    countMonth:     new CountMonthCard(),
    quotas:         new QuotasCard(),
    bs:             new BsCard(),
};