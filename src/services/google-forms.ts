const CLIENT_ID = '212799217975-8cob20cmnnmqnf2g2sa67gffs4mcqa25.apps.googleusercontent.com';
const API_KEY = 'AIzaSyBwXKpzS2syulUlt_OghvgoJkstPsRE70k';
const DISCOVERY_DOC = 'https://forms.googleapis.com/$discovery/rest?version=v1';
const SCOPES = 'https://www.googleapis.com/auth/forms.body';

let tokenClient: google.accounts.oauth2.TokenClient;
let gapiInited = false;
let gisInited = false;

export async function initializeGoogleAPI(): Promise<void> {
  const script = document.createElement('script');
  script.src = 'https://apis.google.com/js/api.js';
  document.body.appendChild(script);

  return new Promise((resolve) => {
    script.onload = () => {
      gapi.load('client', async () => {
        await gapi.client.init({
          apiKey: API_KEY,
          discoveryDocs: [DISCOVERY_DOC],
        });
        gapiInited = true;
        maybeEnableButtons();
        resolve();
      });
    };
  });
}

export async function initializeGIS(): Promise<void> {
  const script = document.createElement('script');
  script.src = 'https://accounts.google.com/gsi/client';
  document.body.appendChild(script);

  return new Promise((resolve) => {
    script.onload = () => {
      tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: '', // defined later
      });
      gisInited = true;
      maybeEnableButtons();
      resolve();
    };
  });
}

function maybeEnableButtons() {
  return gapiInited && gisInited;
}

export async function createGoogleForm(formData: any): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) {
          reject(resp);
          return;
        }
        
        const form = await gapi.client.forms.forms.create({
          info: {
            title: formData.title,
            documentTitle: formData.title,
          },
        });
        
        const formId = form.result.formId;
        
        const requests = formData.questions.map((question: any) => ({
          createItem: {
            item: {
              title: question.title,
              questionItem: {
                question: {
                  required: question.required,
                  textQuestion: question.type === 'text' ? {} : undefined,
                  choiceQuestion: question.type === 'multipleChoice' || question.type === 'checkbox' ? {
                    type: question.type === 'multipleChoice' ? 'RADIO' : 'CHECKBOX',
                    options: question.options.map((option: string) => ({ value: option })),
                  } : undefined,
                  scaleQuestion: question.type === 'scale' ? {
                    low: 1,
                    high: 5,
                  } : undefined,
                },
              },
            },
          },
        }));

        await gapi.client.forms.forms.batchUpdate({
          formId,
          requests,
        });

        resolve(`https://docs.google.com/forms/d/${formId}/viewform`);
      };

      if (gapi.client.getToken() === null) {
        tokenClient.requestAccessToken({ prompt: 'consent' });
      } else {
        tokenClient.requestAccessToken({ prompt: '' });
      }
    } catch (err) {
      reject(err);
    }
  });
}