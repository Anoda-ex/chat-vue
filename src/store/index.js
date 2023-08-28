import { createStore } from 'vuex'
import { getDatabase, ref, child, onValue, push, update, set, remove, get, serverTimestamp, orderByChild, startAt, endAt, query } from "firebase/database";
import { getStorage, ref as storageRefImport, uploadString, getDownloadURL } from "firebase/storage";
import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

import {getDate, getFullDate, getTimeOfDay} from "../helpers/functions"
// Create a new store instance.
const store = createStore({
	state() {
		return {
			user:null,
			myUserData:{},
			usersData:[],
			authError:null,
			globalLoading:true,
			chatsData:{},
			messagesData:{},
			usersData:{},
			subscriptions:{},
			defaultImage:require('../assets/img/no-image.jpg'),
			searchedItems:[],
			searchedItemsLoaded:false,
			selectedChat:null
		}
	},
	mutations: {
		setGlobalLoading(state, bool){
			state.globalLoading=bool;
		},
		setUser(state, user) {
			state.user = user
		},
		setMyUserData(state, myUserData){
			state.myUserData = {
				...myUserData,
				chatsData: myUserData.chatsData||{}
			}
		},
		setChatData(state, chatData){
			state.chatsData[chatData.cid] = chatData.data
		},
		setMessageData(state, messageData){
			state.messagesData[messageData.mid] = messageData.data
		},
		setUserData(state, userData){
			state.usersData[userData.uid] = userData.data
		},
		setAuthError(state, authError){
			state.authError = authError
		},
		setStateData(state, {key, value}){
			state[key] = value
		},
		setFirebaseError(state, {key, errorCode, errorMessage}){
			let errorText=null;
			let errorTextInBrackets = errorMessage.match('.*?\(([^)]*)\).*')[1]
			if(errorTextInBrackets && errorTextInBrackets.split('/')[1]){
				let errorText = errorTextInBrackets.split('/')[1]
				errorText = errorText.split('-').join(' ')
				errorText = errorText[0].toUpperCase() + errorText.slice(1)+'.'
				if(errorText){
					state[key]=errorText
				}
			}
		},
		addSubscription(state, payload){
			state.subscriptions[payload.id] = payload.unsubscribe
		},
		setSearchedItems(state,payload){
			let res = [
				...(Object.entries(payload.chatsData)
					// .filter(([key, value])=>{return !Object.keys(state.myUserData.chatsData).includes(key)})
					.map(([key, value])=>{return{
						cid:key,
						image:value.image||state.defaultImage,
						name:value.name,
						username:value.username,
						type:value.type
					}})),
				...(Object.entries(payload.usersData)
					.filter(([key, value])=>{ return state.user.uid!==key })
					// .filter(([key, value])=>{
					// 	let findedChat = this.chatsData
					// })
					.map(([key, value])=>{return{
						uid:key,
						image:value.image||state.defaultImage,
						name:value.name,
						username:value.username,
						type:'user'
					}})),
			];
			state.searchedItemsLoaded=true
			state.searchedItems = res
		},
		setSearchedItemsToNull(state, payload){
			state.searchedItems = [];
			state.searchedItemsLoaded=false;
		},
		selectChat(state, payload){
			state.selectedChat = payload.item
		}
	},
	actions: {
	
		initApp(context) {
		
			context.dispatch('checkAuth')

		},
		changeUserData(context, userData){
			return new Promise((resolve, reject) => {
			

				let db = getDatabase()
				const userDataRef = ref(db, `/usersData/${context.state.user.uid}`);
				set(userDataRef, {
					...userData
				}).then(res=>{
					resolve();
				});
			  })
		
		},
		createUserData(context, uid){
			let db = getDatabase()
			const userDataRef = ref(db, `/usersData/${uid}`);
			set(userDataRef, {
				name:uid,
				username:uid,
			});
		},
		
		



		signOut(context) {
			const auth = getAuth();
			auth.signOut()
			.then(function() {
			   context.commit('setStateData', {key:'user', value:null})
			   context.commit('setStateData', {key:'myUserData', value:null})
			}, function(error) {
			});
		},

		signInWithGoogle(context){
			return new Promise((resolve, reject) => {
				const provider = new GoogleAuthProvider();
				const auth = getAuth();
				signInWithPopup(auth, provider)
				.then((result) => {
					const credential = GoogleAuthProvider.credentialFromResult(result);
					const token = credential.accessToken;
					const user = result.user;
	
	

					const db = getDatabase();
					const userDataRef = ref(db, `/usersData/${user.uid}`);
					get(userDataRef).then((snapshot) => {
						const data = snapshot.val();
						if(snapshot.exists()){
							context.commit('setMyUserData', data)
							resolve({noUserData:false})

						}else{
							context.dispatch('createUserData', user.uid)
							resolve({noUserData:true})
						}
					  }).catch((error) => {
						console.error(error);
					  });
				}).catch((error) => {
					const errorCode = error.code;
					const errorMessage = error.message;
					context.commit('setFirebaseError', {key:'authError', errorCode, errorMessage})
	
	
					// const email = error.customData.email;a
					const credential = GoogleAuthProvider.credentialFromError(error);
				});
			})
		},


		signInWithPassword(context, data){
			return new Promise((resolve, reject) => {
				const auth = getAuth();
				signInWithEmailAndPassword(auth, data.email, data.password)
				.then((userCredential) => {
					const user = userCredential.user;
					resolve({success:true})
				})
				.catch((error) => {
					const errorCode = error.code;
					const errorMessage = error.message;
					context.commit('setFirebaseError', {key:'authError', errorCode, errorMessage})

				});
			})
			

		},
		signUpWithPassword(context, data){
			return new Promise((resolve, reject) => {
				const auth = getAuth();
				createUserWithEmailAndPassword(auth, data.email, data.password)
				.then((userCredential) => {
					const user = userCredential.user;
					resolve({success:true})
				})
				.catch((error) => {
					const errorCode = error.code;
					const errorMessage = error.message;

					context.commit('setFirebaseError', {key:'authError', errorCode, errorMessage})
				});

			  })
		},


		checkAuth(context){
			const auth = getAuth();
			auth.onAuthStateChanged((user) => {
				if (user) {
				  	console.log("Вошел")
					context.commit('setUser', user)
					context.dispatch('getMyUserData', user.uid)
				} else {
					console.log("Не вошел")
					context.commit('setUser', null)
				}
				context.commit('setGlobalLoading', false)
			})
		},

		addUserToChat(context,payload){
			return new Promise((resolve, reject) => {
				let db = getDatabase()
				const newRef = ref(db, `/chatsData/${payload.cid}/members/${payload.uid}`);
				set(newRef, {
						createdAt: serverTimestamp(),
				}).then(res=>{
					const userDataRef = ref(db, `/usersData/${payload.uid}/chatsData/${payload.cid}`);
					set(userDataRef, {
						createdAt: serverTimestamp(),
					}).then(res=>{
						resolve();
					});
				});
				
			})
		},
		deleteUserFromChat(context,payload){
			return new Promise((resolve, reject) => {
				let db = getDatabase()
				const newRef = ref(db, `/chatsData/${payload.cid}/members/${context.state.user.uid}`);
				remove(newRef).then(res=>{
					const userDataRef = ref(db, `/usersData/${context.state.user.uid}/chatsData/${payload.cid}`);
					if(!payload.chatDeleted){
						remove(userDataRef).then(res=>{
							resolve();
						});
					}
				});
			})
		},

		createPrivateChatData(context, payload){
			return new Promise((resolve, reject) => {
				let db = getDatabase()
				let newRef = push(ref(db, '/chatsData'));
				set(newRef, {
					...payload.chatData,
					type:"private",
					createdAt: serverTimestamp(),

				}).then(res=>{
					context.dispatch('addUserToChat', {
						uid: context.state.user.uid,
						cid: newRef.key
					}).then(res2=>{
						context.dispatch('addUserToChat', {
							uid: payload.contactUid,
							cid: newRef.key
						}).then(res3=>{
							get(newRef).then((snapshot) => {
								const data = snapshot.val();
								if(data){
									resolve(
										{
											...data, 
											cid: newRef.key
										}
									)
								}
							})
						})
	
	
					})
				});

			})
		},
		changeChatData(context, payload){
			return new Promise((resolve, reject) => {
				if(payload.cid && payload.isEditMode){
					let db = getDatabase()
					const newRef = ref(db, `/chatsData/${payload.cid}`);
                    const updates = {};
                    Object.entries(payload.chatData).forEach(([key, value])=>{
                        updates[`/${key}`]=value
                    })
                    console.log('payload', updates);
					update(newRef, updates).then(res=>{
						resolve()
					});
				}else{
					let db = getDatabase()
					let newRef = push(ref(db, '/chatsData'));
					set(newRef, {
						...payload.chatData,
						creator: context.state.user.uid,
						admins:{
							[context.state.user.uid]:{createdAt: serverTimestamp()}
						},
						createdAt: serverTimestamp(),
						
					}).then(res=>{
						context.dispatch('addUserToChat', {
							uid: context.state.user.uid,
							cid: newRef.key
						}).then(res2=>{
							get(newRef).then((snapshot) => {
								const data = snapshot.val();
								if(data){
									resolve(
										{
											...data, 
											cid: newRef.key
										}
									)
								}
							})
						})

					});
					
				}

			  })
		
		},
		deleteChat(context, payload){
			return new Promise((resolve, reject) => {
				{
					let db = getDatabase()
					let newRef = push(ref(db, `/chatsData/${payload.cid}`));
					remove(newRef).then(res=>{
						console.log('deleteChat', res, newRef);
					});
				}
			  })
		},
		


		search(context, {searchValue}){
			const db = getDatabase();
			const searchedChatsDataRef  = query(ref(db, '/chatsData'), orderByChild('username'), startAt(searchValue), endAt(searchValue+"\uf8ff"))
			get(searchedChatsDataRef).then((snapshot) => {
				const chatsData = snapshot.val();
				
				
				const searchedUsersDataRef  = query(ref(db, '/usersData'), orderByChild('username'), startAt(searchValue), endAt(searchValue+"\uf8ff"))
				get(searchedUsersDataRef).then((snapshot) => {
					const usersData = snapshot.val();
					
					context.commit('setSearchedItems',{
						chatsData:chatsData || {},
						usersData:usersData || {}
					})

				}).catch((error) => {
					console.error(error);
				});


			  }).catch((error) => {
				console.error(error);
			  }); 
		},

		addToContacts(context, payload){
			return new Promise((resolve, reject) => {
				let db = getDatabase()
				const userDataRef = ref(db, `/usersData/${context.state.user.uid}/contactsData/${payload.uid}`);
				set(userDataRef, {
					createdAt: serverTimestamp(),
				}).then(res=>{
					resolve();
				});
			})
		},
		deleteFromContacts(context, payload){
			return new Promise((resolve, reject) => {
				let db = getDatabase()
				const userDataRef = ref(db, `/usersData/${context.state.user.uid}/contactsData/${payload.uid}`);
				remove(userDataRef).then(res=>{
					resolve();
				});
			})
		},


		messageSubscibe(context, payload){
			if(context.state.subscriptions[payload.mid]) return 
			const db = getDatabase();
			const chatDataRef = ref(db, `/messagesData/${payload.mid}`);
			let unsubscribe = onValue(chatDataRef, (snapshot) => {
				const data = snapshot.val();
				if(data){
					context.commit('setMessageData', {mid:payload.mid, data: data})
					if(data.uid){
						context.dispatch('userSubscribe', {uid:data.uid})
					}
				}
			});
			this.commit('addSubscription', {id: payload.mid, unsubscribe:unsubscribe})
		},

		// flow
		chatSubscribe(context, payload){
			if(context.state.subscriptions[payload.cid]) return 
			const db = getDatabase();
			const chatDataRef = ref(db, `/chatsData/${payload.cid}`);
			let unsubscribe = onValue(chatDataRef, (snapshot) => {
				const data = snapshot.val();
				if(data){
					context.commit('setChatData', {cid:payload.cid, data: data})
					if(data.messagesData){
						Object.keys(data.messagesData).forEach(mid=>{
							context.dispatch('messageSubscibe', {mid:mid})
						})
					}

					if(data.members){
						Object.keys(data.members).forEach(uid=>{
							context.dispatch('userSubscribe', {uid:uid})
						})
					}

					
				}
			});
			this.commit('addSubscription', {id: payload.cid, unsubscribe:unsubscribe})

		},
		userSubscribe(context, payload){
			if(context.state.subscriptions[payload.uid]) return 

			const db = getDatabase();
			const userDataRef = ref(db, `/usersData/${payload.uid}`);
			let unsubscribe = onValue(userDataRef, (snapshot) => {
				const data = snapshot.val();
				if(data){
					context.commit('setUserData', {uid:payload.uid, data: data})
				
				}
			});
			this.commit('addSubscription', {id: payload.uid, unsubscribe:unsubscribe})

		},
		getMyUserData(context, uid){
			const db = getDatabase();
			const userDataRef = ref(db, `/usersData/${uid}`);
			onValue(userDataRef, (snapshot) => {
				const data = snapshot.val();
				if(data){
					context.commit('setMyUserData', data)
					if(data.chatsData){
						Object.entries(data.chatsData).forEach(([key, item])=>{
							context.dispatch('chatSubscribe', {cid:key})
						})
					}
					if(data.contactsData){
						Object.entries(data.contactsData).forEach(([key, item])=>{
							context.dispatch('userSubscribe', {uid:key})
						})
					}
				}else{
					context.dispatch('createUserData', uid)
				}
			});
		},

		sendMessage(context, payload){
			let message={
				messageBody:{
					text:payload.text||null,
					voiceMessageData:payload.voiceMessageData||null
				},
				createdAt: serverTimestamp(),
				uid: context.state.user.uid
			}
			return new Promise((resolve, reject) => {
				let db = getDatabase()
				let newRef = push(ref(db, '/messagesData'));
				set(newRef, message).then(res=>{
					let mid = newRef.key
					let chatMessagesRef = ref(db, `chatsData/${payload.cid}/messagesData/${mid}`);
					set(chatMessagesRef, {
						mid:mid,
						createdAt: serverTimestamp(),
						uid:context.state.user.uid
					}).then(res1=>{
						resolve()
					})
				});

			})
			return 'llllleeeee'
		}
	},
	getters:{
		isLoggedIn (state) {
			return state.user && state.user.uid
		},
		chatsDataList(state){
			if(!state.chatsData || !(state.myUserData.chatsData)) return []; 
			let res = []
			Object.entries(state.myUserData.chatsData).forEach(([cid])=>{
				let item = state.chatsData[cid] 
				if(item){	
					if(item.type==="private"){
						let findedUid = Object.keys(item.members).filter(uid=>uid!==state.user.uid)[0];
						let findedUser = state.usersData[findedUid];
						if(findedUser){
							item.name=findedUser.name;
							item.image=findedUser.image;
						}
					}
					let typeName = null;
					if(item.type==="channel"){
						typeName = 'Channel'
					}else if (item.type==="group"){
						typeName = "Chat"
					}else if (item.type==="private"){
						typeName = "Chat"
					}
					let time = null;
					let isPrivate = item.type==='private';
					let messagesData=[]
					if(item.messagesData){
						Object.keys(item.messagesData).forEach(mid=>{
							let messageData = state.messagesData[mid]
							if(messageData){
								let type='text';
								if(messageData.messageBody.voiceMessageData){
									type='voiceMessage'
								}
								messagesData.push({
									...messageData,
									isMyMessage: messageData.uid===state.user.uid,
									mid: mid,
									time:getTimeOfDay(messageData.createdAt),
									type:type

								})
							}
						})
					}
					let lastMessageText = null;
					if(messagesData.length){
						let lastMessage=messagesData[messagesData.length-1]
						time = getDate(lastMessage.createdAt);
						lastMessageText = lastMessage.messageBody.text
					}else{
						time = getDate(item.createdAt);
						lastMessageText = `${typeName} has been created`
					}
					// this.mes
					res.push({
						cid:cid,
						image:item.image||state.defaultImage,
						name:item.name,
						username:item.username,
						lastMessageText:lastMessageText,
						time: time,
						members:item.members,
						type:item.type,
						isPrivate: isPrivate,
						admins:item.admins,
						messagesData:messagesData,
						startDate:getFullDate(item.createdAt),
					})
				}
			})
			return res
		
		},
		contactsData(state){
			if(!state.myUserData.contactsData) return []
			let res=[]
			Object.entries(state.myUserData.contactsData).forEach(([uid])=>{
				let item = state.usersData[uid] 
				if(item){	
					res.push({
						uid:uid,
						image:item.image||state.defaultImage,
						name:item.name,
					})
				}
			})
			return res
		},
		
		userInContacts(state, getters){
			return (uid)=>{
				return getters.contactsData.find(item=>item.uid===uid)
			}
		},
		chatInUserChats(state, getters){
			return (cid)=>{
				return getters.chatsDataList.find(item=>item.cid===cid)
			}
		},
		userIsChatAdmin(state, getters){
			return (cid)=>{
				let chatData=getters.chatsDataList.find(item=>item.cid===cid)
				return !!(chatData && chatData.admins && chatData.admins[state.user.uid])
				
			}
		},
		searchedItems(state, getters){
			// .re
			let replacedChats= []
			let searchedItems = state.searchedItems.filter(item=>{
				if(item.uid){
					let findedChat = getters.chatsDataList.find(chat=>{
						return chat.type==='private' && chat.members[item.uid]
					})
					if(findedChat){
						findedChat = JSON.parse(JSON.stringify(findedChat))
						findedChat.name=findedChat.name
						replacedChats.push(findedChat)
						return false
					}
				}else{
					let findedChat = getters.chatsDataList.find(chat=>{
						return chat.cid === item.cid
					})
					if(findedChat){
						findedChat = JSON.parse(JSON.stringify(findedChat))
						findedChat.name=findedChat.name
						replacedChats.push(findedChat)
						return false
					}
				}
				return true
			})
			return [...replacedChats, ...searchedItems]
		},
		getChatData(state, getters){
			return (cid)=>{
				return getters.chatsDataList.find(item=>item.cid===cid)
			}
		},
		contactsDataForChatFiltered(state, getters){
			return (chatDataMembers)=>{
				return getters.contactsData.filter(item=>{
					return !(chatDataMembers && Object.keys(chatDataMembers).includes(item.uid))
				})
			}
		},
		selectedChat(state, getters){
			if(!state.selectedChat) return null;
			let selectedChat = state.selectedChat
			let chat = getters.chatsDataList.find(item=>item.cid===selectedChat.cid);
			// !Object.keys(state.myUserData.chatsData).includes(state.selectedChat.type==='user'? state.selectedChat.uid : state.selectedChat.cid )
			if(!chat ){
				chat = JSON.parse(JSON.stringify(selectedChat))
				chat.userNotInChat = true
			}else{
				chat.userNotInChat = false
			}
			return chat;
		}
	}
})
export default store