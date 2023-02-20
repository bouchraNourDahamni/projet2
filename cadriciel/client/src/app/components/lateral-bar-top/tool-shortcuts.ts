import { Tools } from './../../enums/tools';

export const shortcuts: Map<string, Tools> =  new Map<string, Tools>([
    ['c', Tools.Pencil          ],
    ['w', Tools.Brush           ],
    ['y', Tools.Pen             ],
    ['p', Tools.Feather         ],
    ['a', Tools.Aerosol         ],
    ['1', Tools.Rectangle       ],
    ['2', Tools.Ellipse         ],
    ['3', Tools.Polygon         ],
    ['s', Tools.Selection       ],
    ['r', Tools.ColorApplicator ],
    ['b', Tools.ColorBucket     ],
    ['e', Tools.Eraser          ],
    ['t', Tools.Text            ],
    ['i', Tools.Pipette         ],
    ['l', Tools.Line            ],
    ['o', Tools.Stamp           ],
]);
