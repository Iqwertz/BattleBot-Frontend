import { Bot } from './battle-map.component';

const defaultTrackLength = 25;

export const defaultBots: Bot[] = [
  {
    color: 3,
    crashed: false,
    direction: 'up',
    name: 'Testing Bot',
    position: [-1, -1],
    track: [],
    trackColor: 4,
    trackLength: 1,
    brain: {
      vars: {
        obstacleRadar: {
          forward: false,
          left: false,
          right: false,
        },
        trackRadar: {
          forward: false,
          left: false,
          right: false,
        },
        ownTrackRadar: {
          forward: false,
          left: false,
          right: false,
        },
      },
      default: {
        instructions: [
          'left',
          'forward',
          'forward',
          'right',
          'forward',
          'forward',
          'forward',
          'forward',
          'right',
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
          'forward',
          'forward',
          'right',
          'forward',
          'forward',
          'left',
          'forward',
          'forward',
          'forward',
          'forward',
          'forward',
          'forward',
          'forward',
          'forward',
          'forward',
          'forward',
          'forward',
          'left',
          'forward',
          'left',
          'forward',
          'forward',
          'forward',
          'right',
          'forward',
          'right',
          'forward',
          'forward',
          'right',
          'forward',
          'forward',
          'forward',
          'forward',
          'forward',
          'forward',
        ],
      },
      onTrackDetected: {
        instructions: [
          {
            type: 'if',
            test: {
              operator: '==',
              value: 'true',
              variable: 'trackRadarLeft',
            },
            whenTrue: {
              instructions: ['left', 'forward'],
            },
            else: {
              instructions: [
                {
                  type: 'if',
                  test: {
                    operator: '==',
                    value: 'true',
                    variable: 'trackRadarRight',
                  },
                  whenTrue: {
                    instructions: ['right', 'forward'],
                  },
                  else: {
                    instructions: [
                      {
                        type: 'if',
                        test: {
                          operator: '==',
                          value: 'true',
                          variable: 'trackRadarForward',
                        },
                        whenTrue: {
                          instructions: ['forward'],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
      onOwnTrackDetected: {
        instructions: [],
      },
      onWallDetected: {
        instructions: [
          {
            type: 'if',
            test: {
              operator: '==',
              value: 'true',
              variable: 'radarForward',
            },
            whenTrue: {
              instructions: [
                {
                  type: 'if',
                  test: {
                    operator: '==',
                    value: 'false',
                    variable: 'radarLeft',
                  },
                  whenTrue: {
                    instructions: ['left', 'forward'],
                  },
                  else: {
                    instructions: [
                      {
                        type: 'if',
                        test: {
                          operator: '==',
                          value: 'false',
                          variable: 'radarRight',
                        },
                        whenTrue: {
                          instructions: ['right', 'forward'],
                        },
                        else: {
                          instructions: ['right', 'right', 'forward'],
                        },
                      },
                    ],
                  },
                },
              ],
            },
            else: {
              instructions: [
                {
                  type: 'if',
                  test: {
                    operator: '==',
                    value: 'false',
                    variable: 'radarLeft',
                  },
                  whenTrue: {
                    instructions: ['left', 'forward'],
                  },
                  else: {
                    instructions: [
                      {
                        type: 'if',
                        test: {
                          operator: '==',
                          value: 'true',
                          variable: 'radarRight',
                        },
                        whenTrue: {
                          instructions: ['right', 'forward'],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    color: 3,
    crashed: false,
    direction: 'up',
    name: 'Testing Bot',
    position: [-1, -1],
    track: [],
    trackColor: 4,
    trackLength: 1,
    brain: {
      vars: {
        obstacleRadar: {
          forward: false,
          left: false,
          right: false,
        },
        trackRadar: {
          forward: false,
          left: false,
          right: false,
        },

        ownTrackRadar: {
          forward: false,
          left: false,
          right: false,
        },
      },
      default: {
        instructions: [
          'forward',
          'right',
          'forward',
          'left',
          'left',
          'right',
          'forward',
          'forward',
          'forward',
          'forward',
          'right',
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
          'forward',
          'forward',
          'forward',
          'forward',
          'forward',
          'left',
          'left',
          'forward',
          'left',
          'forward',
        ],
      },
      onOwnTrackDetected: {
        instructions: [],
      },
      onTrackDetected: {
        instructions: [
          {
            type: 'if',
            test: {
              operator: '==',
              value: 'true',
              variable: 'trackRadarLeft',
            },
            whenTrue: {
              instructions: ['left', 'forward'],
            },
            else: {
              instructions: [
                {
                  type: 'if',
                  test: {
                    operator: '==',
                    value: 'true',
                    variable: 'trackRadarRight',
                  },
                  whenTrue: {
                    instructions: ['right', 'forward'],
                  },
                  else: {
                    instructions: [
                      {
                        type: 'if',
                        test: {
                          operator: '==',
                          value: 'true',
                          variable: 'trackRadarForward',
                        },
                        whenTrue: {
                          instructions: ['forward'],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
      onWallDetected: {
        instructions: [
          {
            type: 'if',
            test: {
              operator: '==',
              value: 'true',
              variable: 'radarForward',
            },
            whenTrue: {
              instructions: [
                {
                  type: 'if',
                  test: {
                    operator: '==',
                    value: 'false',
                    variable: 'radarLeft',
                  },
                  whenTrue: {
                    instructions: ['left'],
                  },
                  else: {
                    instructions: [
                      {
                        type: 'if',
                        test: {
                          operator: '==',
                          value: 'false',
                          variable: 'radarRight',
                        },
                        whenTrue: {
                          instructions: ['right'],
                        },
                        else: {
                          instructions: ['right', 'right'],
                        },
                      },
                    ],
                  },
                },
              ],
            },
            else: {
              instructions: [
                {
                  type: 'if',
                  test: {
                    operator: '==',
                    value: 'true',
                    variable: 'radarLeft',
                  },
                  whenTrue: {
                    instructions: [],
                  },
                  else: {
                    instructions: [
                      {
                        type: 'if',
                        test: {
                          operator: '==',
                          value: 'true',
                          variable: 'radarLeft',
                        },
                        whenTrue: {
                          instructions: ['forward'],
                        },
                      },
                      {
                        type: 'if',
                        test: {
                          operator: '==',
                          value: 'true',
                          variable: 'radarRight',
                        },
                        whenTrue: {
                          instructions: ['forward'],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    color: 3,
    crashed: false,
    direction: 'up',
    name: 'Testing Bot',
    position: [-1, -1],
    track: [],
    trackColor: 4,
    trackLength: 1,
    brain: {
      vars: {
        obstacleRadar: {
          forward: false,
          left: false,
          right: false,
        },
        trackRadar: {
          forward: false,
          left: false,
          right: false,
        },
        ownTrackRadar: {
          forward: false,
          left: false,
          right: false,
        },
      },
      default: {
        instructions: [
          'right',
          'right',
          'forward',
          'forward',
          'forward',
          'right',
          'forward',
          'left',
          'forward',
          'forward',
          'forward',
          'forward',
          'forward',
          'forward',
          'forward',
          'forward',
          'forward',
          'forward',
          'forward',
          'forward',
          'forward',
          'forward',
          'left',
          'right',
          'forward',
          'left',
        ],
      },
      onTrackDetected: {
        instructions: [],
      },
      onOwnTrackDetected: {
        instructions: [],
      },
      onWallDetected: {
        instructions: [
          {
            type: 'if',
            test: {
              operator: '==',
              value: 'true',
              variable: 'radarForward',
            },
            whenTrue: {
              instructions: [
                {
                  type: 'if',
                  test: {
                    operator: '==',
                    value: 'false',
                    variable: 'radarLeft',
                  },
                  whenTrue: {
                    instructions: ['left'],
                  },
                  else: {
                    instructions: [
                      {
                        type: 'if',
                        test: {
                          operator: '==',
                          value: 'false',
                          variable: 'radarRight',
                        },
                        whenTrue: {
                          instructions: ['right'],
                        },
                        else: {
                          instructions: ['right', 'right'],
                        },
                      },
                    ],
                  },
                },
              ],
            },
            else: {
              instructions: [
                {
                  type: 'if',
                  test: {
                    operator: '==',
                    value: 'true',
                    variable: 'radarLeft',
                  },
                  whenTrue: {
                    instructions: [],
                  },
                  else: {
                    instructions: [
                      {
                        type: 'if',
                        test: {
                          operator: '==',
                          value: 'true',
                          variable: 'radarLeft',
                        },
                        whenTrue: {
                          instructions: ['forward'],
                        },
                      },
                      {
                        type: 'if',
                        test: {
                          operator: '==',
                          value: 'true',
                          variable: 'radarRight',
                        },
                        whenTrue: {
                          instructions: ['forward'],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  },
  /*  {
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
  }, */
];
