import { ApplicationCommandDataResolvable, BitFieldResolvable, Client, ClientEvents, Collection, GatewayIntentsString, IntentsBitField, Partials } from "discord.js";
import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
import { CommandType, ComponentsButtons, ComponentsModal, ComponentsSelect } from "./types/command";
import { EventType } from "./types/event";
dotenv.config();

const fileCondition = (fileName: string) => fileName.endsWith('.ts') || fileName.endsWith('.js');

export class ExtendedClient extends Client{
    public commands: Collection<string, CommandType> = new Collection();
    public buttons: ComponentsButtons = new Collection();
    public selects: ComponentsSelect = new Collection();
    public modals: ComponentsModal = new Collection();
    constructor(){
        super({
            intents: Object.keys(IntentsBitField.Flags) as BitFieldResolvable<GatewayIntentsString, number>,
            partials: [
                Partials.Channel, Partials.GuildMember, Partials.GuildScheduledEvent,
                Partials.Message, Partials.Reaction, Partials.ThreadMember, Partials.User
            ]
        })
    }
    public start() {
        this.registerEvents();
        this.registerModules();
        this.login(process.env.Token);
    }
    private registerCommands(commands: Array<ApplicationCommandDataResolvable>) {
        this.application?.commands.set(commands)
        .then(() => {
            console.log('Slash commands successfully defined.'.green);
        })
        .catch((error) => {
            console.log(`Error while trying to define slash commands: ${error}`.red);
        });
    }
    private registerModules() {
        const slashcommands: Array<ApplicationCommandDataResolvable> = new Array();

        const commandsPath = path.join(__dirname, "..", "commands");

        fs.readdirSync(commandsPath).forEach(local => {
            fs.readdirSync(commandsPath + `/${local}/`).filter(fileCondition).forEach(async fileName => {
                const command: CommandType = (await import(`../commands/${local}/${fileName}`))?.default;
                const {name, run, buttons, modals, select} = command;

                if (name) {
                    this.commands.set(name, command);
                    slashcommands.push(command);

                    if (buttons) buttons.forEach((run, key) => this.buttons.set(key, run));
                    if (modals) modals.forEach((run, key) => this.modals.set(key, run));
                    if (select) select.forEach((run, key) => this.selects.set(key, run));
                }
            });
        })

        this.on("ready", () => this.registerCommands(slashcommands));
    }
    private registerEvents() {
        const eventsPath = path.join(__dirname, '..', 'events');

        fs.readdirSync(eventsPath).forEach(local => {
            fs.readdirSync(eventsPath + `/${local}/`).filter(fileCondition).forEach(async filename => {
                const {name, run, once}: EventType<keyof ClientEvents> = (await import(`${eventsPath}/${local}/${filename}`))?.default;

                try {
                    if (name) (once) ? this.once(name, run) : this.on(name, run);
                } catch (error) {
                    console.log(`Error while trying to register events: ${error}`);
                }
            })
        });
    }
}