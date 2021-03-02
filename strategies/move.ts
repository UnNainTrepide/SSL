import { ActionSchema, Context, ServiceBroker } from 'moleculer'
import { Control } from '@ssl/types/internal/control/'
import Strategies from '@ssl/types/internal/task-manager/tasks/strategies'

import { state } from '../../models/GameState'

export default class Move extends Strategies {
  name = 'move';

  public constructor(public id: number) {
    super()
  }

  public static declaration: ActionSchema = {
    params: {
      id: {
        type: 'number', min: 0, max: 15,
      },
    },
    handler(ctx: Context<{ id: number }>): void {
      state.assign.register([ctx.params.id], new Move(ctx.params.id))
    },
  }

  compute(broker: ServiceBroker): boolean {
    broker.logger.debug(state.data.ball)

    void broker.call('bots-gateway.control', {
      id: this.id,
      yellow: true,
      velocity:
      {
        normal: 0,
        angular: 0,
        tangent: 0.1,
      },
    } as Control)

    return false
  }
}
