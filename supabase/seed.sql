-- マスターデータ + 初期ギアデータ

-- カテゴリ
insert into categories (code, label, sort_order) values
  ('racquet', 'ラケット', 1),
  ('string',  'ストリング', 2),
  ('shoes',   'シューズ',   3),
  ('apparel', 'ウェア',     4),
  ('setting', 'セッティング', 5);

-- ブランド
insert into brands (name) values
  ('Wilson'),
  ('Babolat'),
  ('Yonex'),
  ('HEAD'),
  ('Luxilon'),
  ('Nike'),
  ('Asics'),
  ('Uniqlo');

-- ギア
insert into gears (category_code, brand_id, name, description, gauge_mm)
select 'racquet', b.id, 'Pro Staff 97 v14',
       'フェデラー使用モデル系譜。コントロール重視のフラット系プレーヤー向け。', null
from brands b where b.name = 'Wilson';

insert into gears (category_code, brand_id, name, description, gauge_mm)
select 'racquet', b.id, 'Pure Aero 2023',
       'ナダル使用モデル。強烈なスピンを打ちたいプレーヤーに人気。', null
from brands b where b.name = 'Babolat';

insert into gears (category_code, brand_id, name, description, gauge_mm)
select 'racquet', b.id, 'EZONE 98',
       'ISOMETRIC フレームで広いスイートスポット。オールラウンド向け。', null
from brands b where b.name = 'Yonex';

insert into gears (category_code, brand_id, name, description, gauge_mm)
select 'racquet', b.id, 'Speed MP 2024',
       'ジョコビッチ使用モデル。コントロールとパワーのバランス。', null
from brands b where b.name = 'HEAD';

-- ストリング (ゲージあり)
insert into gears (category_code, brand_id, name, description, gauge_mm)
select 'string', b.id, 'ALU Power',
       'ツアーで最も使われるポリエステル。シャープな打球感。', 1.25
from brands b where b.name = 'Luxilon';

insert into gears (category_code, brand_id, name, description, gauge_mm)
select 'string', b.id, 'RPM Blast',
       'スピン量に定評のあるポリエステル。', 1.25
from brands b where b.name = 'Babolat';

insert into gears (category_code, brand_id, name, description, gauge_mm)
select 'string', b.id, 'Poly Tour Pro',
       '柔らかめのポリで腕に優しい。', 1.25
from brands b where b.name = 'Yonex';

insert into gears (category_code, brand_id, name, description, gauge_mm)
select 'string', b.id, 'Poly Tour Pro',
       '細めゲージで打球感を重視。', 1.20
from brands b where b.name = 'Yonex';

-- シューズ
insert into gears (category_code, brand_id, name, description, gauge_mm)
select 'shoes', b.id, 'Air Zoom Vapor Pro 2',
       '軽量で俊敏な動きを重視したモデル。', null
from brands b where b.name = 'Nike';

insert into gears (category_code, brand_id, name, description, gauge_mm)
select 'shoes', b.id, 'Gel-Resolution 9',
       '安定感とクッション性の定番。', null
from brands b where b.name = 'Asics';

-- ウェア
insert into gears (category_code, brand_id, name, description, gauge_mm)
select 'apparel', b.id, 'DRY-EX ポロシャツ',
       '錦織圭モデル系。速乾性◎コスパ良好。', null
from brands b where b.name = 'Uniqlo';

-- セッティング
insert into gears (category_code, brand_id, name, description, gauge_mm)
select 'setting', b.id, 'Pro Staff 97 v14 × Luxilon ALU Power 1.25 / 50lbs',
       '定番のコントロール系セッティング。', null
from brands b where b.name = 'Wilson';

insert into gears (category_code, brand_id, name, description, gauge_mm)
select 'setting', b.id, 'Pure Aero × RPM Blast 1.25 / 52lbs',
       'スピン特化のナダル系セッティング。', null
from brands b where b.name = 'Babolat';
