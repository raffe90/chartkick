Rails.application.routes.draw do
  # root to: 'pages#index'
  root to: 'charts#index'
  get 'charts', to: 'charts#index', as: 'chart_index'

  get '/cholesterol-session', to: 'cholesterols#cholesterol_session'

  post '/charts/cholesterol/intervention', to: "cholesterols#intervention_session"

  resources :cholesterol, controller: 'cholesterols', path: '/charts/cholesterol'

end
