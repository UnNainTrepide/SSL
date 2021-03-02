import { ActionSchema, Context, ServiceBroker } from 'moleculer'
import { MoveToPacket } from '@ssl/types/internal/control/packet'
import Strategies from '@ssl/types/internal/task-manager/tasks/strategies'
import {
  sin, cos, pi,sqrt,square,
 } from 'mathjs'
import { state } from '../../models/GameState'

/*
 * call "MSB.cball" '{ "nb_rad" : [number,radius] }' (To try with npm run repl)
 * call "MSB.cball" '{ "nb_rad" : [4,1] }'
 */
export default class CircleB extends Strategies {
  name = 'CircleB';

  public constructor(public nb_rad: Array<number>) {
    super()
  }

  public static declaration: ActionSchema = {
    params: {
      nb_rad: {
        type: 'array', items: 'number', min: 2, max: 2,
      },//Nombre de robot à déplacer, rayon du cercle
      
    },
    handler(ctx: Context<{ nb_rad: Array<number> }>): void {
      ctx.broker.logger.info('MoveToPacket packet received')
      state.assign.register(ctx.params.nb_rad, new CircleB(ctx.params.nb_rad))
      
        },
  }
  compute(broker: ServiceBroker): boolean {
    const Xball = state.data.ball.position.x
    const Yball = state.data.ball.position.y
    const distance = this.nb_rad[1]
    const nbrobot = this.nb_rad[0]
    

    for(let i=0; i<nbrobot;i++){
      broker.logger.info(i)
      var angle = 2*pi*i/nbrobot
      var X = Xball + (distance* cos(angle))
      var Y = Yball + (distance* sin(angle)) 
      if(this.nb_rad[i]){ 
      void broker.call('bots-control.moveTo', {
        id: i,
        target: {x: X, y: Y},
        orientation: pi+angle,
        expectedReachTime: 10,
      } as MoveToPacket)
  }
  }
    return true
  }
}