# FHIR Veteran Data & Loader
R4 synthetic patient data records and data loading utilities.

```sh
export FHIR_SERVER=https://your_fhir_server_base.com
ts-node src/bin/load-fhir.ts create -b 'ADMIN:your_password' src/data/dependencies
ts-node src/bin/load-fhir.ts create -b 'ADMIN:your_password' src/data/patients
```
Data generated using Synthea with custom configuration and age range representative of the bulk of the veteran population:
java -jar synthea-with-dependencies.jar -c synthea.settings.txt -a 50-70 -s 42

# Author

Preston Lee <preston.lee@prestonlee.com>
