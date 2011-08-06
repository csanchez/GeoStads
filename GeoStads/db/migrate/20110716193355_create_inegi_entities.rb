class CreateInegiEntities < ActiveRecord::Migration
  def self.up
    create_table :inegis, :options=>"ENGINE=MyISAM", :force => true do |t|
      t.integer :cve_ent
      t.string  :nom_ent
      t.integer :cve_mun
      t.string  :nom_mun
      t.integer :cve_loc
      t.string  :nom_loc
      t.point   :point
      t.integer :pob_total
      t.integer :pob_m
      t.integer :pob_f
      t.float   :grado_prom_esc
      t.float   :grado_prom_esc_m
      t.float   :grado_prom_esc_f
      t.integer :pob_econ_act
      t.integer :pob_econ_act_m
      t.integer :pob_econ_act_f
      t.integer :pob_econ_inact
      t.integer :pob_econ_inact_m
      t.integer :pob_econ_inact_f
      t.integer :pob_sin_ss
      t.integer :pob_con_ss
      t.integer :pob_sin_imss
      t.integer :pob_sin_iste
      t.integer :pob_sin_istee
      t.integer :pob_sin_segp
      t.integer :pob_soltera
      t.integer :pob_casada
      t.integer :pob_relig_cat
      t.integer :pob_relig_no_cat
      t.integer :pob_relig_otra
      t.integer :pob_sin_relig
      t.boolean :gmaps

      t.timestamps
    end
  end
  #add_index :inegi_entities, :lat_lon, :spatial => true
  def self.down
    drop_table :inegi_entities
  end
end
