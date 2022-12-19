const { Client, GatewayIntentBits,PermissionsBitField } = require('discord.js');
require('dotenv').config()
require('discord-reply');
const client = new Client();
const mongoose = require('mongoose');
const nodemon = require('nodemon')
import fetch from 'node-fetch';
const comma = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

main().catch(err => console.log(err));

async function main() {
  const db = await mongoose.connect('mongodb+srv://hdx:hdx@hdx.jbxedff.mongodb.net/?retryWrites=true&w=majority');
}

const q = new mongoose.Schema({
	keyWord:String,
	question:String,
	answer:String
});
const Question = mongoose.model('Question', q);

const questionList = []

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', async (msg) => {
	if(msg.member.roles){
if (msg.member.roles.cache.some(r=>["Admin", "Team", "Moderator"].includes(r.name))){
	const firstSpace = msg.content.indexOf(" ")
	const firstHyphen = msg.content.indexOf("-")
	const secondHyphen = msg.content.indexOf("-",firstHyphen+1)
	const keyWordtext = msg.content.slice(firstSpace+1,firstHyphen)
	const questiontext = msg.content.slice(firstHyphen+1,secondHyphen)
	const answertext = msg.content.slice(secondHyphen+1,msg.content.length)

	if(msg.content.startsWith("!add")){
		question = new Question(
			{
				keyWord:keyWordtext,
				question:questiontext,
				answer:answertext
			}
		)
		await question.save()
		
	}else if(msg.content.startsWith("!list")){
		const questions = await Question.find()
		const q =[]
		var y = 1;
		questions.forEach((e)=>{
			q.push(y+") "+e.keyWord+"---"+ e.question +"---"+ e.answer)
		y++;
		})
		if(questions.length == 0){
			msg.lineReplyNoMention("list is empty")
		}else{
			msg.lineReplyNoMention(q)
		}
	}
	else if(msg.content.startsWith("!questions")){
		const questionsdb = await Question.find()
		const questions = []
		var z = 1;
		questionsdb.forEach((e)=>{
		questions.push(z+") "+e.keyWord+"---"+ e.question)
		z++;
		})
		if(questionsdb.length == 0){
			msg.lineReplyNoMention("list is empty")
		}else{
			msg.lineReplyNoMention(questions)
		}
	}else if(msg.content.startsWith("!delete")){
		const firstSpace = msg.content.indexOf(" ")
		const keyWordtext = msg.content.slice(firstSpace+1)
		await Question.find({keyWord:keyWordtext}).deleteOne()
	}else if(msg.content.startsWith("!alldelete")){
		await Question.deleteMany();
	}else if(msg.content.startsWith("!help")){
		msg.lineReplyNoMention("!add - !delete - !alldelete - !questions - !list - !help");
	}else{
		Question.findOne({keyWord:msg.content}, (err,data)=>{
			if(data){
				msg.channel.send(data.answer)
				msg.delete({timeout:5000})
			}
		})
	}
	}else if(msg.channel == "hdxinfo-bot"){
		if(msg.content.startsWith("!list")){
			const questions = await Question.find()
			const q =[]
			var y = 1;
			questions.forEach((e)=>{
				q.push(y+") "+e.keyWord+"---"+ e.question +"---"+ e.answer)
			y++;
			})
			if(questions.length == 0){
				msg.lineReplyNoMention("list is empty")
			}else{
				msg.lineReplyNoMention(q)
			}
		}
		else if(msg.content.startsWith("!questions")){
			const questionsdb = await Question.find()
			const questions = []
			var z = 1;
			questionsdb.forEach((e)=>{
			questions.push(z+") "+e.keyWord+"---"+ e.question)
			z++;
			})
			if(questionsdb.length == 0){
				msg.lineReplyNoMention("list is empty")
			}else{
				msg.lineReplyNoMention(questions)
			}
		}else if(msg.content.startsWith("!help")){
			msg.lineReplyNoMention("!add - !delete - !alldelete - !questions - !list - !help");
		}else{
			Question.findOne({keyWord:msg.content}, (err,data)=>{
				if(data){
					msg.channel.send(data.answer)
					msg.delete({timeout:5000})
				}
			})
		}
	}
	}
});

client.on('message', async (msg) => {
	if(msg.content == "Wen moon" || msg.content == "wen moon" || msg.content == "when moon" ||
	 msg.content == "When moon" || msg.content == "moon"|| msg.content == "Moon" ){
		msg.lineReplyNoMention("soon")
	}
});


const {BigNumber, ethers } = require("ethers");
const {ADDRESS, SHDXADDRESS  } = require("./info/address.js");
const { HDX_ABI, SHDX_ABI} = require("./info/abi.js");

const provider = new ethers.providers.AlchemyProvider( "arbitrum" , process.env.api );
const _HdxToken = new ethers.Contract(ADDRESS,HDX_ABI,provider);
const _ShdxToken = new ethers.Contract(SHDXADDRESS, SHDX_ABI,provider);

	fetch('https://api.coingecko.com/api/v3/coins/hydranet/tickers')
    .then( a => a.json())
    .then( b => {setPrice(b.tickers[0].last.toString().substr(0,6))})

// StakedHdx= BigNumber.from(StakedHdx).toString().slice(0,-9);
// setD1(BigNumber.from(shdxAmount).toString().slice(0,-9));

// fetch('https://api.coingecko.com/api/v3/coins/hydranet/tickers')
// .then( a => a.json())
// .then( b => {setPrice(b.tickers[0].last.toString().substr(0,6))})


client.on('message', async (msg) => {
	if(msg.content == "!hdx" || msg.content == "!Hdx" || msg.content == "!HDX"  ){
		var x = await fetch('https://api.coingecko.com/api/v3/coins/hydranet/tickers');
		var y = await x.json();
		var z = await y.tickers[0].last.toString().substr(0,6);

		var TotalHdx = await _HdxToken.totalSupply();
		var StakedHdx = await _HdxToken.balanceOf("0xd20cdf95a08acdf8aa360232caeda6e59a06951d")
		msg.lineReplyNoMention(
		"*  HDX SUPPLY  =  "+ comma(BigNumber.from(TotalHdx).toString().slice(0,-9))+'\n'+
		"*  STAKED HDX  =  "+ comma(BigNumber.from(StakedHdx).toString().slice(0,-9))+'\n'+
		"*  STAKE RATIO  =  "+ (BigNumber.from(StakedHdx).toString().slice(0,-9)/
		BigNumber.from(TotalHdx).toString().slice(0,-9)*100).toString().slice(0,-12)+"%"+'\n'+ 
		"*  INFLATION    =  7.5%"+'\n'+ 
		"*  CURRENT APY  = " + " 9.4%" + 
		"*  HDX PRICE  = " + z 
		)
		
	}
	
	

});

client.login(process.env.token);