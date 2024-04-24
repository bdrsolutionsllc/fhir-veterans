#!/usr/bin/env node

import dotenv from 'dotenv';
dotenv.config();

import * as fs from 'fs';
import path from 'path';
import { program } from 'commander';
import axios from 'axios';
import { Bundle, BundleEntry } from 'fhir/r4';

const url = process.env.FHIR_SERVER;
if (!url) {
    console.error('FHIR_SERVER environment variable is not set');
    process.exit(1);
}

program.name('load-fhir').description("Load the remote FHIR resource server");

program.command('create')
    .description('Load the FHIR resources from the directory')
    .argument('<directory>', 'Directory of FHIR JSON files')
    .option('-b, --basic-auth <username:password>', 'Basic authentication credentials in username:password format')
    .action(async (directory, options) => {
        let d = path.join(__dirname, '..', '/', '..', directory);
        let base64: string | null = null;
        if (options.basicAuth) {
            base64 = Buffer.from(options.basicAuth).toString('base64');
            console.log('Using HTTP Basic Authentication');
        }

        if (fs.existsSync(d)) {
            // let fileData = loadFiles(d);
            const files = fs.readdirSync(directory);
            for (const file of files) {
                const filePath = path.join(directory, file);
                console.log(`Loading ${filePath}`);
                const data = fs.readFileSync(filePath, 'utf8');
                let headers: any = { 'Accept': 'application/json', 'Content-Type': 'application/json' };
                if (base64) {
                    headers['Authorization'] = 'Basic ' + base64;
                }
                await axios.post(`${url}`, data, { headers: headers }).then((response) => {
                    console.log(response.status);
                }).catch((error) => {
                    console.error(error.response.status);
                    console.error(error.response.data);
                });
            }
        } else {
            console.error('Directory does not exist');
            process.exit(1);
        }
    }
    );


program.command('delete')
    .description('Delete the service FHIR resources specified in the directory')
    .argument('<directory>', 'Directory of FHIR JSON files')
    .option('-b, --basic-auth <username:password>', 'Basic authentication credentials in username:password format')
    .action(async (directory, options) => {
        let d = path.join(__dirname, '..', '/', '..', directory);
        let base64: string | null = null;
        if (options.basicAuth) {
            base64 = Buffer.from(options.basicAuth).toString('base64');
            console.log('Using HTTP Basic Authentication');
        }

        if (fs.existsSync(d)) {
            // let fileData = loadFiles(d);
            const files = fs.readdirSync(directory);
            for (const file of files) {
                const filePath = path.join(directory, file);
                console.log(`Deleting ${filePath}`);
                const data: Bundle = JSON.parse(fs.readFileSync(filePath, 'utf8')) as any as Bundle;
                let entries = data.entry;
                let resource = entries?.[0]?.resource;
                // console.log();

                let rType = resource?.resourceType;
                let rId = resource?.id;
                let headers: any = { 'Accept': 'application/json', 'Content-Type': 'application/json' };
                if (base64) {
                    headers['Authorization'] = 'Basic ' + base64;
                }
                await axios.delete(`${url}/${rType}/${rId}&_cascade=delete`, { headers: headers }).then((response) => {
                    console.log(response.status);
                }).catch((error) => {
                    console.error(error.response.status);
                    console.error(error.response.data);
                });
            }
        } else {
            console.error('Directory does not exist');
            process.exit(1);
        }
    }
    );

program.parse();

// function loadFiles(directory: string): string[] {
//     let d = path.join(__dirname, '..', '/', '..', directory);
//     let fileData: string[] = [];
//     for (const file of fileData) {
//         const filePath = path.join(directory, file);
//         console.log(`Loading ${filePath}`);
//         const data = fs.readFileSync(filePath, 'utf8');
//         fileData.push(data);
//     }
//     return fileData;
// }