import { ICoordinates } from '../interfaces/coordinates';

export class RectangleServiceConstants {
    public static readonly STROKE_ALIGNMENT: string = 'inner';

    public static readonly INITIAL_COORDINATES: ICoordinates = {
        x: -1,
        y: -1,
    };
    public static readonly CURRENT_COORDINATES: ICoordinates = {
        x: -1,
        y: -1,
    };

    public static readonly PERIMETER_FILL_OPACITY: string = '0';
    public static readonly PERIMETER_OUTLINE_COLOR: string = 'gray';
    public static readonly PERIMETER_DASHARRAY: string = '4';

    public static readonly RECTANGLE_DEFAULT_DASHARRAY: string = '0';
    public static readonly RECTANGLE_DEFAULT_RX: string = '0';

    public static readonly RECTANGLE_ROUND_RX: string = '25';
    public static readonly RECTANGLE_DASH_DASHARRAY: string = '10';

    public static readonly TRANSPARENT_FILL: string = '0';
    public static readonly TRANSPARENT_STROKE: string = '0';

    public static readonly TRANSPARENCY_POURCENTAGE_STRING: string = '%';
}
