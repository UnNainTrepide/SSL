import { ActionSchema, Context, ServiceBroker } from 'moleculer'
import { MoveToPacket } from '@ssl/types/internal/control/packet'
import Strategies from '@ssl/types/internal/task-manager/tasks/strategies'

import { state } from '../../models/GameState'

/**
 * call "MSB.mtball" '{ "id_X_Y" : [[id,X,Y],[id,X,Y],...] }' (To try with npm run repl)
 * 
 * call "MSB.mtball" '{ "id_X_Y" : [[0,6,0],[1,1,0],[2,2.5,1],[3,2.5,-1],[4,4,1.5],[5,4,0.5]] }'
 * call "MSB.mtball" '{ "id_X_Y" : [[0,0,4],[1,0,3],[2,0,2],[3,0,1],[4,0,-1],[5,0,-2]] }'
 * call "MSB.mtball" '{ "id_X_Y" : [[0,1,1],[1,1,0],[2,0,1],[3,1,-1],[4,0,-1],[5,-1,0]] }'
 */
export default class MoveToB extends Strategies {
  name = 'MoveToB';

  public constructor(public id_X_Y: number[][]) {
    super()
  }

  public static declaration: ActionSchema = {
    params: {
      id_X_Y: {
        type: 'array', items: {type: 'array', items: 'number', min: 3, max: 3,}, min: 0, max: 99, 
      },
    },
    
    

    handler(ctx: Context<{ id_X_Y: number[][]}>): void {
      ctx.broker.logger.info('MoveToPacket packet received')
      for(let i=0; i<8;i++){ // Pour chaque tableau [id,X,Y] :
        //(j'ai mis i<8 car array.length n'a pas fonctionné)
        if(ctx.params.id_X_Y[i]){ // si le tableau existe : 
          state.assign.register(ctx.params.id_X_Y[i], new MoveToB(ctx.params.id_X_Y))
        }
      }
    },
  }
  compute(broker: ServiceBroker): boolean {
    const X = state.data.ball.position.x
    const Y = state.data.ball.position.y
    for(let i=0; i<8;i++){ 
      if(this.id_X_Y[i]){ 
    void broker.call('bots-control.moveTo', {
      id: this.id_X_Y[i][0],
      target: {x: this.id_X_Y[i][1]+X, y: this.id_X_Y[i][2]+Y},
      orientation: 0,
      expectedReachTime: 10,
    } as MoveToPacket)
  }
  }
    return false
  }
}