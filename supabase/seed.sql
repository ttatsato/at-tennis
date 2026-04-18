-- 初期データ: ブランド + ラケット + ストリング

-- ブランド
insert into brands (name_ja, name_en) values
  ('ウィルソン',   'Wilson'),
  ('バボラ',       'Babolat'),
  ('ヨネックス',   'Yonex'),
  ('ヘッド',       'HEAD'),
  ('ルキシロン',   'Luxilon'),
  ('ゴーセン',     'Gosen'),
  ('テクニファイバー', 'Tecnifibre');

-- ラケット
insert into racquets (brand_id, name_ja, name_en, head_size_sqin, weight_g, balance_mm, stiffness_ra,
                      description_ja, description_en)
select b.id, 'プロスタッフ 97 v14', 'Pro Staff 97 v14', 97.0, 315.0, 310.0, 65.0,
       'フェデラー使用モデル系譜。コントロール重視のフラット系プレーヤー向け。',
       'Federer-lineage frame favored by flat-hitting control players.'
from brands b where b.name_en = 'Wilson';

insert into racquets (brand_id, name_ja, name_en, head_size_sqin, weight_g, balance_mm, stiffness_ra,
                      description_ja, description_en)
select b.id, 'ピュアアエロ 2023', 'Pure Aero 2023', 100.0, 300.0, 320.0, 71.0,
       'ナダル使用モデル。強烈なスピンを打ちたいプレーヤーに人気。',
       'Nadal''s signature racquet, known for heavy topspin potential.'
from brands b where b.name_en = 'Babolat';

insert into racquets (brand_id, name_ja, name_en, head_size_sqin, weight_g, balance_mm, stiffness_ra,
                      description_ja, description_en)
select b.id, 'イーゾーン 98', 'EZONE 98', 98.0, 305.0, 315.0, 66.0,
       'ISOMETRIC フレームで広いスイートスポット。オールラウンド向け。',
       'ISOMETRIC frame with a broad sweet spot, good for all-court play.'
from brands b where b.name_en = 'Yonex';

insert into racquets (brand_id, name_ja, name_en, head_size_sqin, weight_g, balance_mm, stiffness_ra,
                      description_ja, description_en)
select b.id, 'スピード MP 2024', 'Speed MP 2024', 100.0, 300.0, 320.0, 66.0,
       'ジョコビッチ使用モデル。コントロールとパワーのバランス。',
       'Djokovic''s racquet — balanced control and power.'
from brands b where b.name_en = 'HEAD';

-- ストリング
insert into strings (brand_id, name_ja, name_en, gauge_mm, material, description_ja, description_en)
select b.id, 'アルパワー', 'ALU Power', 1.25, 'poly',
       'ツアーで最も使われるポリエステル。シャープな打球感。',
       'The most-used poly on tour, known for crisp feel.'
from brands b where b.name_en = 'Luxilon';

insert into strings (brand_id, name_ja, name_en, gauge_mm, material, description_ja, description_en)
select b.id, 'アルパワー', 'ALU Power', 1.20, 'poly',
       '細ゲージで打球感重視。テンション維持はやや短め。',
       'Thinner gauge for enhanced feel; shorter tension life.'
from brands b where b.name_en = 'Luxilon';

insert into strings (brand_id, name_ja, name_en, gauge_mm, material, description_ja, description_en)
select b.id, 'RPM ブラスト', 'RPM Blast', 1.25, 'poly',
       'スピン量に定評のあるポリエステル。',
       'Poly string renowned for spin production.'
from brands b where b.name_en = 'Babolat';

insert into strings (brand_id, name_ja, name_en, gauge_mm, material, description_ja, description_en)
select b.id, 'ポリツアープロ', 'Poly Tour Pro', 1.25, 'poly',
       '柔らかめのポリで腕に優しい。',
       'Softer poly that''s easier on the arm.'
from brands b where b.name_en = 'Yonex';

insert into strings (brand_id, name_ja, name_en, gauge_mm, material, description_ja, description_en)
select b.id, 'エックスワン バイフェイズ', 'X-One Biphase', 1.30, 'multi',
       '定番のマルチフィラメント。上質な打球感。',
       'Classic multifilament with premium feel.'
from brands b where b.name_en = 'Tecnifibre';
