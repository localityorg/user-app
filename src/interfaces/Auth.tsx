export interface Auth {
	user: {
		id: string;
		vendor: boolean;
		token: string;
		refreshToken: string;
	};
	logout: any;
	login: any;
}
