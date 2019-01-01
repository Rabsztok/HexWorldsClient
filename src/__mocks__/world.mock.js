import World from 'models/world'
import Canvas from 'models/canvas'

const mock = World.create({
  canvas: Canvas.create(),
  size: 4,
  regions: {
    'b545cf2a-484a-4dd5-b79c-9100dd1d2cde': {
      z: 152,
      y: -1,
      x: -151,
      state: 'ready',
      id: 'b545cf2a-484a-4dd5-b79c-9100dd1d2cde'
    },
    '7aa3e17d-d1ab-4785-8afd-20f37a20c53f': {
      z: 303,
      y: -153,
      x: -150,
      state: 'edge',
      id: '7aa3e17d-d1ab-4785-8afd-20f37a20c53f'
    }
  },
  name: 'test',
  id: '27d0e393-6171-48fc-9c13-94eeef3edb7c'
})
export default mock
