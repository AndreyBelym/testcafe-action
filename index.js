const { execSync } = require('child_process');
const { getInput } = require('@actions/core');

function log (message) {
    console.log(message);
}

function getInputStr (argValue) {
    if (!argValue)
        return 'not specified';

    return argValue;
}

const testCafeArguments = getInput('args');

const version   = getInput('version');
const branch    = getInput('branch');
const commit    = getInput('commit');
const branchCmd = branch && !commit ? `-b ${branch}` : '';

const gitCloneCmd    = `git clone https://github.com/DevExpress/testcafe.git ${branchCmd}`;
const gitCheckoutCmd = `git -C testcafe checkout ${commit}`;

let testCafeCmd = '';

log(`VERSION: ${getInputStr(version)}`);
log(`BRANCH: ${getInputStr(branch)}`);
log(`COMMIT: ${getInputStr(commit)}`);

if (branch || commit) {
    log('Cloning the TestCafe repository...');
    log(gitCloneCmd);
    execSync(gitCloneCmd, { stdio: 'inherit' });

    log('Checking out the repository...');
    log(gitCheckoutCmd);
    execSync(gitCheckoutCmd, { stdio: 'inherit' });

    log('Installing npm packages...');
    execSync(`cd testcafe && npm install `, { stdio: 'inherit' });

    log('Building TestCafe...');
    execSync(`cd testcafe && npx gulp fast-build`, { stdio: 'inherit' });

    testCafeCmd = 'node testcafe/bin/testcafe';
}
else {
    log('Installing TestCafe from npm...');

    execSync(`npm i testcafe@${version}`);

    testCafeCmd = 'npx testcafe';
}

log('Running TestCafe...');
execSync(`${testCafeCmd} ${testCafeArguments}`, { stdio: 'inherit' });
