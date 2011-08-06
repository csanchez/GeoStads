# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20110803013901) do

  create_table "inegis", :force => true do |t|
    t.integer  "cve_ent"
    t.string   "nom_ent"
    t.integer  "cve_mun"
    t.string   "nom_mun"
    t.integer  "cve_loc"
    t.string   "nom_loc"
    t.spatial  "point",            :limit => {:type=>"point"}
    t.integer  "pob_total"
    t.integer  "pob_m"
    t.integer  "pob_f"
    t.float    "grado_prom_esc"
    t.float    "grado_prom_esc_m"
    t.float    "grado_prom_esc_f"
    t.integer  "pob_econ_act"
    t.integer  "pob_econ_act_m"
    t.integer  "pob_econ_act_f"
    t.integer  "pob_econ_inact"
    t.integer  "pob_econ_inact_m"
    t.integer  "pob_econ_inact_f"
    t.integer  "pob_sin_ss"
    t.integer  "pob_con_ss"
    t.integer  "pob_sin_imss"
    t.integer  "pob_sin_iste"
    t.integer  "pob_sin_istee"
    t.integer  "pob_sin_segp"
    t.integer  "pob_soltera"
    t.integer  "pob_casada"
    t.integer  "pob_relig_cat"
    t.integer  "pob_relig_no_cat"
    t.integer  "pob_relig_otra"
    t.integer  "pob_sin_relig"
    t.boolean  "gmaps"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "polygons", :force => true do |t|
    t.string   "name"
    t.string   "data_base"
    t.string   "html_color"
    t.spatial  "polygon",    :limit => {:type=>"polygon"}
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
