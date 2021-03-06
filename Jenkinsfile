#!/usr/bin/env groovy
pipeline {
    agent any
    stages {
        stage("Install app dependencies") {
            steps {
                dir("app") {
                    sh "npm install"
                }
            }
        }
        stage("Unit tests") {
            steps {
                sh "./app/scripts/unit-tests.sh"
            }
        }
        stage("Style check") {
            steps {
                sh "./app/scripts/style-check.sh"
            }
        }
        stage("Acceptance tests") {
            steps {
                script {
                    def dockerImage = docker.build("l3ku/cd-demo-app:${env.BUILD_ID}", "app")
                    dockerImage.withRun("-p 80:8888") {
                        sh "./smoke-test.sh 127.0.0.1"
                        sh "./app/scripts/acceptance-tests.sh"
                        input "Is the build version ${env.BUILD_ID} deployable after performing manual tests?"
                    }
                    docker.withRegistry("https://registry.hub.docker.com/l3ku/cd-demo-app/", "jenkins-docker-hub-auth") {
                        dockerImage.push()
                    }
                }

            }
        }
        stage("Deployment") {
            steps {
                sleep 10
                sh "ansible-playbook config.yml -i inventory/production.yml --extra-vars 'dockerImageVersion=${env.BUILD_ID}'"
                sh "./smoke-test.sh 18.197.117.188"
            }
        }
    }
    post {
        failure {
            mail to: "leo.toikka@student.tut.fi",
            subject: "Failed Deployment: ${currentBuild.fullDisplayName}",
            body: "Something is wrong with ${env.BUILD_URL}"
        }
    }
}
