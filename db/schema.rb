# encoding: UTF-8
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
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20160425215358) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "care_teams", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "caregivers", force: :cascade do |t|
    t.integer  "user_id"
    t.integer  "care_team_id"
    t.datetime "created_at",   null: false
    t.datetime "updated_at",   null: false
  end

  create_table "charts", force: :cascade do |t|
    t.datetime "created_at",                 null: false
    t.datetime "updated_at",                 null: false
    t.string   "type"
    t.boolean  "approved",   default: false
    t.boolean  "opened",     default: false
    t.integer  "user_id"
  end

  add_index "charts", ["user_id"], name: "index_charts_on_user_id", using: :btree

  create_table "charts_entries", id: false, force: :cascade do |t|
    t.integer "entry_id"
    t.integer "chart_id"
  end

  add_index "charts_entries", ["chart_id"], name: "index_charts_entries_on_chart_id", using: :btree
  add_index "charts_entries", ["entry_id"], name: "index_charts_entries_on_entry_id", using: :btree

  create_table "charts_interventions", id: false, force: :cascade do |t|
    t.integer "chart_id"
    t.integer "intervention_id"
  end

  add_index "charts_interventions", ["chart_id"], name: "index_charts_interventions_on_chart_id", using: :btree
  add_index "charts_interventions", ["intervention_id"], name: "index_charts_interventions_on_intervention_id", using: :btree

  create_table "entries", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string   "symbol"
    t.integer  "value"
    t.datetime "date"
    t.string   "chart_type"
    t.integer  "user_id"
  end

  add_index "entries", ["user_id"], name: "index_entries_on_user_id", using: :btree

  create_table "interventions", force: :cascade do |t|
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
    t.string   "title"
    t.datetime "start"
    t.datetime "end"
    t.string   "description"
    t.integer  "index"
    t.string   "type"
    t.string   "chart_type"
    t.integer  "user_id"
  end

  add_index "interventions", ["user_id"], name: "index_interventions_on_user_id", using: :btree

  create_table "notifications", force: :cascade do |t|
    t.string   "subject"
    t.text     "content"
    t.integer  "sender_id"
    t.integer  "receiver_id"
    t.string   "action_url"
    t.boolean  "delivered",   default: false
    t.datetime "created_at",                  null: false
    t.datetime "updated_at",                  null: false
  end

  create_table "notifications_users", id: false, force: :cascade do |t|
    t.integer "user_id"
    t.integer "notifications_id"
  end

  add_index "notifications_users", ["notifications_id"], name: "index_notifications_users_on_notifications_id", using: :btree
  add_index "notifications_users", ["user_id"], name: "index_notifications_users_on_user_id", using: :btree

  create_table "read_marks", force: :cascade do |t|
    t.integer  "readable_id"
    t.string   "readable_type", null: false
    t.integer  "reader_id"
    t.string   "reader_type",   null: false
    t.datetime "timestamp"
  end

  add_index "read_marks", ["reader_id", "reader_type", "readable_type", "readable_id"], name: "read_marks_reader_readable_index", using: :btree

  create_table "roles", force: :cascade do |t|
    t.string   "name"
    t.integer  "resource_id"
    t.string   "resource_type"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "roles", ["name", "resource_type", "resource_id"], name: "index_roles_on_name_and_resource_type_and_resource_id", using: :btree
  add_index "roles", ["name"], name: "index_roles_on_name", using: :btree

  create_table "users", force: :cascade do |t|
    t.date     "date_of_birth"
    t.string   "first_name"
    t.string   "last_name"
    t.string   "gender"
    t.string   "phone_number"
    t.boolean  "diabetes"
    t.boolean  "heart_disease"
    t.json     "elation_payload"
    t.integer  "elation_id",             limit: 8
    t.integer  "care_teams_id"
    t.string   "notify_every"
    t.datetime "notify_by",                                     null: false
    t.datetime "created_at",                                    null: false
    t.datetime "updated_at",                                    null: false
    t.string   "avatar"
    t.string   "email",                            default: "", null: false
    t.string   "encrypted_password",               default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",                    default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
  end

  add_index "users", ["care_teams_id"], name: "index_users_on_care_teams_id", using: :btree
  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree

  create_table "users_roles", id: false, force: :cascade do |t|
    t.integer "user_id"
    t.integer "role_id"
  end

  add_index "users_roles", ["user_id", "role_id"], name: "index_users_roles_on_user_id_and_role_id", using: :btree

end
