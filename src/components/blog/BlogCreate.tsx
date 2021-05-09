import { ReactElement, useCallback } from 'react';
import _get from 'lodash/get';
import { Redirect, useHistory } from 'react-router';
import { makePostRequest } from '../../common/api';
import { default as config } from '../../config/config.json';
import { APICallerProps } from '../../types/blog.types';

import './BlogCreate.css';
import { markdown2Text } from '../../common/utils';
import { getContent } from '../../common/content';

function BlogCreate({ token }: APICallerProps): ReactElement {
  const history = useHistory();

  const onSubmit = useCallback(async (e) => {
    e.preventDefault();
    const { elements }: HTMLFormElement = e.target;
    const data = {
      title: _get(elements, 'title.value'),
      markdown: _get(elements, 'markdown.value'),
      headline: _get(elements, 'headline.value'),
      tags: ['default'],
    };

    if (!data.headline) {
      data.headline = markdown2Text(data.markdown, 175);
    }

    try {
      await makePostRequest(`${config.serverBaseUrl}/`, data, token || '');
      history.push('/blog');
    } catch (e) {
      if (e.statusCode === 401) {
        history.replace('signin', { from: 'create' });
      }
      console.log(e);
      console.log('Post creation failed.');
    }
  }, []);

  if (token === null) {
    return (
      <Redirect
        to={{
          pathname: 'signin',
          state: { from: 'create' },
        }}
      />
    );
  }

  return (
    <div className="create-post-page">
      <h2>{getContent('create-post-heading')}</h2>
      <form className="pure-form create-post-form" onSubmit={onSubmit}>
        <input
          className="blogpost-title"
          type="text"
          name="title"
          placeholder={getContent('create-post-title-placeholder')}
        />
        <textarea
          className="blogpost-textarea"
          placeholder={getContent('create-post-editor-placeholder')}
          name="markdown"
        ></textarea>
        <input
          type="text"
          className="blogpost-headline"
          name="headline"
          placeholder={getContent('create-post-headline-placeholder')}
        />
        <button className="pure-button pure-button-primary" type="submit">
          {getContent('create-post-save-button')}
        </button>
      </form>
    </div>
  );
}

export { BlogCreate };
