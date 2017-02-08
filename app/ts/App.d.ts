interface MediaFileObject {
    path: string,
    name: string,
    subs: Array<string>,
    birthtime: number
}

interface SubTitleObj {
    cnName: string,
    enName?: string,
    id: string,
    lang?: Array<string>
}


declare module "*.png" {
    let __a__: string;
    export = __a__;
    // let __a__: string;
    // export default __a__;
}