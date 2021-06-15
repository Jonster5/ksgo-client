import firebase from 'firebase/app';
import 'firebase/firestore';

export type KSGO_ID_TYPE = 'HOST' | 'CLIENT';

export const GET_KSGO_ID = (type: KSGO_ID_TYPE, value: string) =>
	`KSGO_${type}_${value}`;

export const GET_KSGO_FIREBASE = (config: Object): Database => {
	if (!firebase.apps.length) {
		firebase.initializeApp(config);
	}
	return firebase.firestore();
};

export type Database = firebase.firestore.Firestore;
export type CollectionRef = firebase.firestore.CollectionReference;
export type DocRef = firebase.firestore.DocumentReference;

export interface DBGameInfo {
	KSGO_ID: string;
	maxPlayers: number;
	name: string;
	private: boolean;
	timeOfCreation: number;
}

export interface RemoteSendInfo {
	id: string;
	x: number;
	y: number;
	r: number;
	forward: boolean;
	right: boolean;
	left: boolean;
	reverse: boolean;
}

export interface HostSendInfo {
	map: { id: string; x: number; y: number }[];
	ships: RemoteSendInfo[];
}

export interface HostJoinInfo {
	map: {
		stars: {
			id: string;
			x: number;
			y: number;
			mass: number;
			color: string;
		}[];
		planets: {
			id: string;
			x: number;
			y: number;
			mass: number;
			color: string;
		}[];
		asteroids: {
			id: string;
			x: number;
			y: number;
			mass: number;
			color: string;
		}[];
		spawns: { x: number; y: number; size: number }[];
	};
	players: {
		type: string;
		id: string;
		x: number;
		y: number;
		r: number;
		forward: boolean;
		right: boolean;
		left: boolean;
		reverse: boolean;
	}[];
}
