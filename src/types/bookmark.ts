export interface bookmarkCount {
    isSuccess: boolean,
    code: string,
    message: string,
    result: {
	    totalCount : number;
	    postCount : number;
	    ootdCount : number;
    }
}