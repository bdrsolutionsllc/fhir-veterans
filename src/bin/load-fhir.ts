#!/usr/bin/env node

import dotenv from 'dotenv';
dotenv.config();

import * as fs from 'fs';
import path from 'path';
import { program } from 'commander';
import axios from 'axios';

const url = process.env.FHIR_SERVER;
if (!url) {
    console.error('FHIR_SERVER environment variable is not set');
    process.exit(1);
}

program.name('load-fhir').description("Load the remote FHIR resource server");

program.command('load')
    .description('Load the FHIR resources from the directory')
    .argument('<directory>', 'Directory of FHIR JSON files')
    .action(async (directory) => {
        let d = path.join(__dirname, '..', '/', '..', directory);
        if (fs.existsSync(d)) {
            const files = fs.readdirSync(directory);
            for (const file of files) {
                const filePath = path.join(directory, file);
                console.log(`Loading ${filePath}`);
                const data = fs.readFileSync(filePath, 'utf8');
                await axios.post(`${url}`, data, { headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' } }).then((response) => {
                    console.log(response.status);
                }).catch((error) => {
                    console.error(error.data);
                });
            }
        } else {
            console.error('Directory does not exist');
            process.exit(1);
        }
    }
    );

program.parse();