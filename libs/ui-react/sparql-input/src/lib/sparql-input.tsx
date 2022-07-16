import { useRef, useEffect } from 'react';

import { EditorView, basicSetup } from 'codemirror';
import { StreamLanguage } from '@codemirror/language';
import { EditorState, Transaction } from '@codemirror/state';
import * as lang from '@codemirror/legacy-modes/mode/sparql';

import './sparql-input.scss';

/**
 * Type definition of mandatory and optional properties of the {@link SparqlInput} component
 */
export interface SparqlInputProps {
  /**
   * css classes to apply to the wrapper
   */
  className?: string;
  /**
   * disable editing features
   */
  readonly?: boolean;
  /** the current sparql value*/
  value?: string;
  /**
   * invoked when the sparql code changed
   */
  onChange?: (value: string) => void;
}

/**
 * Renders a input field for SPARQL with syntax highlighting
 *
 * Uses codemirror
 * Partially taken from https://github.com/tbjgolden/react-codemirror6
 *
 * @category React Component
 */
export function SparqlInput(props: SparqlInputProps): JSX.Element {
  const { value, onChange, readonly } = props;
  const editorParentElRef = useRef<HTMLDivElement>(null);
  // This ref is needed to allow changes to prevent binding the
  // initial value to the EditorView init effect, to allow
  // the new value to be the starting value when reinitialized
  const valueRef = useRef(value);
  valueRef.current = value;

  // This ref is needed to allow changes to the onChange prop
  // without reinitializing the EditorView
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  // This ref contains the CodeMirror EditorView instance
  const editorRef = useRef<null | {
    view: EditorView;
  }>(null);

  // This ref is used to store pending changes, which enables
  // controlled input behavior.
  const changeHandlerRef = useRef<null | ((newValue: string) => boolean)>(null);
  useEffect(() => {
    if (editorParentElRef.current !== null) {
      let view: EditorView | undefined = undefined;
      const state: EditorState = EditorState.create({
        doc: valueRef.current,
        extensions: [
          basicSetup,
          StreamLanguage.define(lang.sparql),
          EditorState.readOnly.of(readonly || false),
          EditorState.transactionFilter.of((tr: Transaction) => {
            const editorView = view;
            if (editorView !== undefined) {
              const prevDoc = editorView.state.doc.toString();
              const nextDoc = tr.newDoc.toString();
              if (prevDoc === nextDoc) {
                return tr;
              } else {
                changeHandlerRef.current = (newValue: string) => {
                  changeHandlerRef.current = null;
                  if (newValue === nextDoc) {
                    editorView.dispatch(
                      editorView.state.update({
                        changes: tr.changes,
                        selection: tr.selection,
                        effects: tr.effects,
                        scrollIntoView: tr.scrollIntoView,
                        filter: false,
                      })
                    );
                    return true;
                  } else {
                    return false;
                  }
                };
                onChangeRef.current?.(nextDoc);
                return [];
              }
            } else {
              return [];
            }
          }),
        ],
      });
      view = new EditorView({
        state,
        parent: editorParentElRef.current,
      });
      editorRef.current = {
        view,
      };
    }

    return () => {
      if (editorRef.current !== null) {
        editorRef.current.view.destroy();
        editorRef.current = null;
      }
    };
  }, [editorParentElRef, readonly]);

  useEffect(() => {
    const changeHandler = changeHandlerRef.current;
    const handledChange = changeHandler?.(value + '');
    if (handledChange !== true && editorRef.current !== null) {
      editorRef.current.view.dispatch(
        editorRef.current.view.state.update({
          changes: {
            from: 0,
            to: editorRef.current.view.state.doc.toString().length,
            insert: value,
          },
          filter: false,
        })
      );
    }
  }, [value]);

  return (
    <div
      ref={editorParentElRef}
      className={`rounded-md bg-white border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 ${
        readonly ? 'bg-gray-200' : ''
      } ${props.className}`}
    ></div>
  );
}

export default SparqlInput;
