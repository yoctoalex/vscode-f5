import bigiqIcon from '../../../images/BIG-IQ-sticker_transparent.png';
import f5Icon from '../../../images/f5.png';
import bigipxopsFoundMod01 from '../../../images/quickstart/bigip-xops-found-mod01.png';
import bigipxopsFoundMod02 from '../../../images/quickstart/bigip-xops-found-mod02.png';
import bigipxopsFoundMod03 from '../../../images/quickstart/bigip-xops-found-mod03.png';
import bigipxopsFoundMod04 from '../../../images/quickstart/bigip-xops-found-mod04.png';
import f5codeshare from '../../../images/quickstart/f5-codeshare.png';

export const DemoGuidesData = [
 {
    title: 'Scale and Automate BIG-IP Administration: Part 1',
    tags: ['LTM', 'iRules', 'REST API', 'AS3', 'Foundations'],
    contentType: ['Youtube Video'],
    isFeatured: true,
    image: bigipxopsFoundMod01,
    description: 'Foundations for scaling BIG-IP ops: when/why to move beyond click-ops, how to standardize LTM/iRules, and an intro to REST API and AS3 as the building blocks for automation.',
    url: 'https://www.youtube.com/watch?v=QaDYnSpIU6c'
  },
  {
    title: 'Scale and Automate BIG-IP Administration: Part 2',
    tags: ['Terraform', 'Ansible', 'GitOps', 'Workflows', 'Scaling'],
    contentType: ['Youtube Video'],
    isFeatured: true,
    image: bigipxopsFoundMod02,
    description: 'Hands-on automation workflows: chaining Terraform + Ansible, GitOps-driven change control, and patterns to scale BIG-IP configuration safely and repeatably across environments.',
    url: 'https://www.youtube.com/watch?v=yIuNAIEqe_U'
  },
  {
    title: 'Scale and Automate BIG-IP Administration: Part 3',
    tags: ['AS3', 'IaC', 'API Security', 'OpenAPI', 'State Management'],
    contentType: ['Youtube Video'],
    isFeatured: true,
    image: bigipxopsFoundMod03,
    description: 'Deploying BIG-IP as code with AS3, validating APIs with OpenAPI-driven policies, and managing desired vs. observed state to keep app delivery config consistent at scale.',
    url: 'https://www.youtube.com/watch?v=A7d8yajJtCI'
  },
  {
    title: 'Scale and Automate BIG-IP Administration: Part 4',
    tags: ['Operations', 'Lifecycle', 'Observability', 'Logging', 'Troubleshooting'],
    contentType: ['Youtube Video'],
    isFeatured: true,
    image: bigipxopsFoundMod04,
    description: 'Operationalizing automation: day-2 lifecycle management, telemetry and logging for visibility, troubleshooting patterns, and choosing UI vs. script tooling based on team maturity.',
    url: 'https://www.youtube.com/watch?v=JY3S_FBDuCg'
  },
  {
    title: 'F5 VSCode Extension',
    tags: ['Automation', 'BIG-IP'],
    contentType: ['Documentation'],
    icon: f5Icon,
    description: 'The F5 VS Code Extension website. Learn how to use the extension and its features.',
    url: 'https://f5devcentral.github.io/vscode-f5/#/'
  },
  {
    title: 'F5Networks BIG-IP Repos',
    tags: ['GitHub', 'BIG-IP', 'Terraform'],
    contentType: ['GitHub Repository'],
    icon: f5Icon,
    description: 'Collection of official supported F5 BIG-IP related repositories on GitHub, including Terraform modules, iRules, and more.',
    url: 'https://github.com/orgs/F5Networks/repositories?language=&q=big-ip&sort=&type=all'
  },
  {
    title: 'F5 DevCentral BIG-IP Repos',
    tags: ['GitHub', 'BIG-IP', 'DevCentral'],
    contentType: ['GitHub Repository'],
    icon: f5Icon,
    description: 'F5 DevCentral community-supported repos related to F5 BIG-IP, including labs, tools, converters, and more!',
    url: 'https://github.com/orgs/F5DevCentral/repositories?language=&q=big-ip&sort=&type=all'
  },
  // earlier generated assets
  {
    title: 'BIG-IP AS3 User Guide',
    tags: ['AS3', 'REST API'],
    contentType: ['Documentation'],
    icon: f5Icon,
    description: 'This official F5 User Guide contains information on BIG-IP AS3 and how to install and use it.',
    url: 'https://clouddocs.f5.com/products/extensions/f5-appsvcs-extension/latest/userguide/'
  },
  {
    title: 'F5 Fasting Repository',
    tags: ['FAST', 'Automation', 'GitHub'],
    contentType: ['GitHub Repository'],
    icon: bigiqIcon,
    description: 'The purpose of this repo is to collect and document the authoring of templates and use of F5 FAST service.',
    url: 'https://github.com/DumpySquare/f5-fasting'
  },
  {
    title: 'F5 Codeshare',
    tags: ['DevCentral', 'BIG-IP'],
    contentType: [''],
    image: f5codeshare,
    description: 'F5 DevCentral CodeShare is a community-driven repository where users can share code, scripts, and configurations, mostly for BIG-IP. ',
    url: 'https://community.f5.com/category/crowdsrc/kb/codeshare'
  }
];