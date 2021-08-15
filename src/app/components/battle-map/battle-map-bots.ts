import { Bot } from './battle-map.component';
import { environment } from '../../../environments/environment';
import { defaultBotVars } from 'src/app/services/bot-compiler.service';

const defaultTrackLength = 25;

export const defaultBots: Bot[] = [
  {
    name: 'Bot1',
    color: 3,
    position: [-1, -1], //[environment.defaultMapSize[0] - 20, 20],
    direction: 'up',
    track: [],
    trackLength: defaultTrackLength,
    trackColor: 4,
    crashed: false,
    brain: {
      vars: defaultBotVars,
      default: {
        progress: 0,
        instructions: [
          'forward',
          'forward',
          'left',
          'forward',
          'forward',
          'forward',
          'forward',
          'forward',
          'right',
          'forward',
          'right',
          'forward',
          'forward',
          'forward',
          'forward',
          'left',
          'forward',
          'forward',
          'forward',
          'forward',
          'forward',
        ],
      },
      onWallDetected: {
        progress: 0,
        instructions: [

          {
            test: {
              operator: '==',
              value: 'true',
              variable: 'radarForward',
            },
            whenTrue: {
              progress: 0,
              instructions: ['left', 'left', 'forward'],
            },
            else: {
              progress: 0,
              instructions: [
                {
                  test: {
                    operator: '==',
                    value: 'true',
                    variable: 'radarLeft',
                  },
                  whenTrue: {
                    progress: 0,
                    instructions: ['left', 'left', 'forward'],
                  },
                  type: 'if',
                },
                {
                  test: {
                    operator: '==',
                    value: 'true',
                    variable: 'radarRight',
                  },
                  whenTrue: {
                    progress: 0,
                    instructions: ['left', 'left', 'forward'],
                  },
                  type: 'if',
                },
              ],
            },
            type: 'if',
          },
        ],
      },
      onTrackDetected: {
        instructions: [
          {
            test: {
              operator: '==',
              value: 'true',
              variable: 'trackRadarForward',
            },
            whenTrue: {
              instructions: ['left', 'left', 'forward'],
            },
            else: {
              instructions: [
                {
                  test: {
                    operator: '==',
                    value: 'true',
                    variable: 'trackRadarLeft',
                  },
                  whenTrue: {
                    instructions: ['left', 'left', 'forward'],
                  },
                  type: 'if',
                },
                {
                  test: {
                    operator: '==',
                    value: 'true',
                    variable: 'trackRadarRight',
                  },
                  whenTrue: {
                    instructions: ['left', 'left', 'forward'],
                  },
                  type: 'if',
                },
              ],
            },
            type: 'if',
          },
        ],
      },
    },
  },
  {
    name: 'Bot2',
    color: 5,
    position: [-1, -1], //[    Math.round(environment.defaultMapSize[0] / 2),    Math.round(environment.defaultMapSize[1] / 2),],
    direction: 'left',
    track: [],
    trackLength: defaultTrackLength,
    trackColor: 6,
    crashed: false,
    brain: {
      vars: defaultBotVars,
      default: {
        progress: 0,
        instructions: [
          'left',
          'forward',
          'forward',
          'left',
          'forward',
          'right',
          'forward',
          'left',
          'forward',
          'right',
          'forward',
          'forward',
          'left',
          'forward',
          'right',
          'forward',
          'forward',
          'right',
          'forward',
          'forward',
          'left',
          'forward',
          'left',
          'forward',
          'left',
          'forward',
          'forward',
          'forward',
          'forward',
          'right',
          'forward',
          'right',
          'forward',
        ],
      },
      onWallDetected: {
        progress: 0,
        instructions: [
          {
            test: {
              operator: '==',
              value: 'true',
              variable: 'radarForward',
            },
            whenTrue: {
              progress: 0,
              instructions: ['left', 'left', 'forward'],
            },
            else: {
              progress: 0,
              instructions: [
                {
                  test: {
                    operator: '==',
                    value: 'true',
                    variable: 'radarLeft',
                  },
                  whenTrue: {
                    progress: 0,
                    instructions: ['left', 'left', 'forward'],
                  },
                  type: 'if',
                },
                {
                  test: {
                    operator: '==',
                    value: 'true',
                    variable: 'radarRight',
                  },
                  whenTrue: {
                    progress: 0,
                    instructions: ['left', 'left', 'forward'],
                  },
                  type: 'if',
                },
              ],
            },
            type: 'if',
          },
        ],
      },
      onTrackDetected: {
        instructions: [
          {
            test: {
              operator: '==',
              value: 'true',
              variable: 'trackRadarForward',
            },
            whenTrue: {
              instructions: ['left', 'left', 'forward'],
            },
            else: {
              instructions: [
                {
                  test: {
                    operator: '==',
                    value: 'true',
                    variable: 'trackRadarLeft',
                  },
                  whenTrue: {
                    instructions: ['left', 'left', 'forward'],
                  },
                  type: 'if',
                },
                {
                  test: {
                    operator: '==',
                    value: 'true',
                    variable: 'trackRadarRight',
                  },
                  whenTrue: {
                    instructions: ['left', 'left', 'forward'],
                  },
                  type: 'if',
                },
              ],
            },
            type: 'if',
          },
        ],
      },
    },
  },
  {
    name: 'Bot3',
    color: 7,
    position: [-1, -1], //[environment.defaultMapSize[0] - 20, 20],
    direction: 'up',
    track: [],
    trackLength: defaultTrackLength,
    trackColor: 8,
    crashed: false,
    brain: {
      vars: defaultBotVars,
      default: {
        progress: 0,
        instructions: [
          'forward',
          'forward',
          'forward',
          'forward',
          'forward',
          'forward',
          'right',
          'forward',
          'forward',
          'forward',
          'forward',
          'forward',
          'forward',
          'left',
          'forward',
          'forward',
          'forward',
          'forward',
          'forward',
        ],
      },
      onWallDetected: {
        progress: 0,
        instructions: [
          {
            test: {
              operator: '==',
              value: 'true',
              variable: 'radarForward',
            },
            whenTrue: {
              progress: 0,
              instructions: ['left', 'left', 'forward'],
            },
            else: {
              progress: 0,
              instructions: [
                {
                  test: {
                    operator: '==',
                    value: 'true',
                    variable: 'radarLeft',
                  },
                  whenTrue: {
                    progress: 0,
                    instructions: ['left', 'left', 'forward'],
                  },
                  type: 'if',
                },
                {
                  test: {
                    operator: '==',
                    value: 'true',
                    variable: 'radarRight',
                  },
                  whenTrue: {
                    progress: 0,
                    instructions: ['left', 'left', 'forward'],
                  },
                  type: 'if',
                },
              ],
            },
            type: 'if',
          },
        ],
      },
      onTrackDetected: {
        instructions: [
          {
            test: {
              operator: '==',
              value: 'true',
              variable: 'trackRadarForward',
            },
            whenTrue: {
              instructions: [],
            },
            else: {
              instructions: [
                {
                  test: {
                    operator: '==',
                    value: 'true',
                    variable: 'trackRadarLeft',
                  },
                  whenTrue: {
                    instructions: ['left', 'left', 'forward'],
                  },
                  type: 'if',
                },
                {
                  test: {
                    operator: '==',
                    value: 'true',
                    variable: 'trackRadarRight',
                  },
                  whenTrue: {
                    instructions: ['left', 'left', 'forward'],
                  },
                  type: 'if',
                },
              ],
            },
            type: 'if',
          },
        ],
      },
    },
  },
];
