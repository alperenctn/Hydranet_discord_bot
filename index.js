const { Client, GatewayIntentBits,PermissionsBitField } = require('discord.js');
require('dotenv').config()
require('discord-reply');
const client = new Client();
const mongoose = require('mongoose');
const nodemon = require('nodemon')

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

	if (msg.member.roles.cache.some(r=>["Admin", "Team", "Moderator"].includes(r.name)) ){
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
	}else{
		Question.findOne({keyWord:msg.content}, (err,data)=>{
			if(data){
				msg.channel.send(data.answer)
				msg.delete({timeout:5000})
			}
		})
	}
	}
});
client.login(process.env.token);
