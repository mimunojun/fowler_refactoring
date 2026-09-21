# "第６章 リファクタリングはじめの一歩" 写経メモ

## パラメータオブジェクトの導入 (introduce-parameter-object)
### コンストラクタにおけるパラメータプロパティの利用
```ts
class NumberRange {
  constructor(
    min: number,
    max: number,
  ) {}
}
```

TypeScriptでは、 _パラメータプロパティ_ を利用してクラスを定義できる。
「通常フィールド定義」 + 「コンストラクタで純粋代入の初期化」と同等。

ただし、これはNodeのTS実行ではエラーになる。JSへのトランスコンパイルが必要な環境では動かない。

```
 SyntaxError [ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX]: 
 TypeScript parameter property is not supported in strip-only mode
``` 

### readonlyアクセサの利用
```ts
class NumberRange {
  readonly min: number;
  readonly max: number;
  
  constructor(
    min: number,
    max: number,
  ) {
    this.min = min;
    this.max = max;
  }
}
```
TypeScriptでは、`readonly`アクセサにより、クラス外からのアクセスを禁じることが可能。

JavaScriptでは、言語機能として長らく提供されておらず、`_min`などのようにアクセス性を明示していた(書籍でもそう)。
