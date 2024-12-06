import User from "../models/User";

export const excelNameToUserId = async (): Promise<Record<string, string>> => {
    const investors = await User.find().select('excelName _id');
    const mapping: Record<string, string> = {};
    investors.forEach((investor) => {
        mapping[investor.excelName] = investor._id.toString();
    });
    return mapping;
};
