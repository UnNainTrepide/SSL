import { ActionSchema, Context, ServiceBroker } from 'moleculer'
import { Control } from '@ssl/types/internal/control/'
import Strategies from '@ssl/types/internal/task-manager/tasks/strategies'

import { state } from '../../models/GameState'

export default class Turn extends Strategies {
  name = 'turn';

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
      state.assign.register([ctx.params.id], new Turn(ctx.params.id))
    },
  }

  compute(broker: ServiceBroker): boolean {
    // const robot = state.data.robots.allies[this.id]

    void broker.call('bots-gateway.control', {
      id: this.id,
      yellow: true,
      velocity:
      {
        normal: 0,
        angular: 0.2,
        tangent: 0,
      },
    } as Control)

    return false
  }
}