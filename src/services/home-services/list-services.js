import * as reqUtil from "@/api/reqUtil";

export async function goShare(params, settings) {
    return await reqUtil.post({
        url : root + "/fromShare",
        settings
    } , params)
}
