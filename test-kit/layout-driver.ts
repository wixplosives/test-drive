export type Geometry = [number, number, number, number];
export type LayoutMap = { [id: string]: Geometry };

interface LayoutFixtureMapItem {
    col: number;
    row: number;
}

type LayoutFixtureMap = { [id: string]: LayoutFixtureMapItem[]}

export function generateMap(source: string): LayoutMap {
    let col = 0;
    let row = 0;
    const map: LayoutFixtureMap = {};
    for(let ch of source) {
        col++;
        if(ch === '\n') {
            row++;
            col = 0;
        }
        if(ch >= 'a' && ch <= 'z') {
            const record = map[ch] || [];
            record.push({ col, row });
            map[ch] = record;
        }
    }
    const geometry: LayoutMap = {};
    for(let key in map) {
        const record = map[key];
        const x = record[0].col;
        const y = record[0].row;
        const w = record[3].col - x + 1 ;
        const h = record[3].row - y + 1;
        geometry[key] = [x, y, w, h];
    }
    return geometry;
}

export interface DomMap {
    container: HTMLElement;
    [id: string]: HTMLElement;
}

export function dom(source: string): DomMap {
    const layoutMap: LayoutMap = generateMap(source);
    const container: HTMLElement = document.createElement('div');
    const domMap: DomMap = {
        container
    };
    for(let elementId in layoutMap) {
        const element = document.createElement('div');
        const geometry: Geometry = layoutMap[elementId];
        element.id = elementId;
        element.style.position = 'absolute';
        element.style.left = geometry[0] + 'px';
        element.style.top = geometry[1] + 'px';
        element.style.width = geometry[2] + 'px';
        element.style.height = geometry[3] + 'px';
        container.appendChild(element);
        domMap[elementId] = element;
    }
    return domMap;
}

export function getLayoutFixture(source: string): DomMap {
    const fixture = dom(source);
    document.body.appendChild(fixture.container);

    after(function () {
        document.body.removeChild(fixture.container);
    });
    return fixture;
}
