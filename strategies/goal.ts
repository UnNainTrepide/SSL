import { ActionSchema, Context, ServiceBroker } from 'moleculer'
import { MoveToMessage } from '@nodetron/types/control/moveTo'
import Strategies from '@nodetron/types/task-manager/tasks/strategies'
import { sin, cos, pi, sqrt, square, i, atan } from 'mathjs' 
import { state } from '../../models/state'

/**
 * This class is an example of the new way to create Strategies.
 * It is basic and needs to be improved !
 * call "MSB.goal" ' { "ids" : [1] }' (To try with npm run repl)
 */
export default class Goal extends Strategies {
  name = 'goal';

  public constructor(public ids: Array<number>) {
    super()
  }

  public static declaration: ActionSchema = {
    params: {
      ids: {
        type: 'array', items: 'number', min: 1, max: 1,
      },
    },
    handler(ctx: Context<{ ids: Array<number> }>): void {
      ctx.broker.logger.info('MoveToPacket packet received')
      state.assign.register(ctx.params.ids, new Goal(ctx.params.ids))
    },
  }

  compute(broker: ServiceBroker): boolean {
    let defradius = 0.6
    let Xbut = 6
    let Ybut = 0.0    
    let Xball = Xbut-state.world.ball.position.x
    let Yball = Ybut-state.world.ball.position.y
    let angle = atan(Yball/Xball)
    let angle2 = (pi/2)-angle
    let X = Xbut+defradius*sin(angle2+pi)
    let Y = Ybut+defradius*cos(angle2+pi)
    
    //broker.logger.info(angle2,)
    void broker.call('control.moveTo', {
      id: this.ids[0],
      target: { x: X, y: Y },
      orientation: angle+pi,
    } as MoveToMessage)
    return false
  }
}
