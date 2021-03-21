# Pro-Memoria

## What does code in this branch do?

Sends class reminders to Students and Teachers, just before the class begins. 

## What should i do to get my Class Reminders?

- Download Your Time-Tabel as HTML in VTOP <https://vtop.vit.ac.in/vtop/>
- Pre Procses Your HTML by Uploading it here <https://swarag-n.github.io/Pro-Memoria/>
- Get The JSON file
- Fork this Branch
- Add Secrets in GitHub Repo Settings
  - TELEGRAM BOT ID as `TELEGRAM_BOT`
  - PROSSEDJSON as `COURSES`
  - YOUR TELEGRAM CHAT ID as `CHAT_ID`
- Thats it, this setup will send you reminders so you wouldn't miss a class

# How Does this work?

- We have simplified most of the difficult work for you like Preprossing of TimeTabel, finding which slot will be there at what time and repective courses you belong. 
- Basically a CORN task is setuped to send reminders by mapping SLOTS, SLOT Timmings and Your Courses. 

## How do i create my own Telegram BOT and get its ID?

- This will help <https://core.telegram.org/bots#3-how-do-i-create-a-bot>

## Where can i get my TELEGRAM CHAT ID?

 - Ping any of these following bots
   - @get_id_bot
   - @chatid_echo_bot

## How do i add Secerts to my GITHUB Repo?

- Refer here <https://docs.github.com/en/actions/reference/encrypted-secrets>

## How should my final Setup look like

Some Things like this

![Make sure names are not changed](https://user-images.githubusercontent.com/46181010/111894115-0a3f9580-8a2e-11eb-83cb-999a73e3edc1.png)
